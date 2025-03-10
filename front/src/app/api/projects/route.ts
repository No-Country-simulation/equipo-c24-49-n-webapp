import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { Project, Category } from "@/models";
import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/options";

// Función para crear categorías por defecto
async function createDefaultCategories(
  projectId: Types.ObjectId,
  creatorId: string
): Promise<Types.ObjectId[]> {
  const defaultCategories = [
    {
      name: "Recientes",
      project: projectId,
      creator: creatorId,
      description: "Tareas recientes",
    },
    {
      name: "En curso",
      project: projectId,
      creator: creatorId,
      description: "Tareas en desarrollo activo",
    },
    {
      name: "Finalizada",
      project: projectId,
      creator: creatorId,
      description: "Tareas completadas",
    },
  ];

  // Crear categorías y devolver sus IDs
  const createdCategories = await Category.insertMany(defaultCategories);
  return createdCategories.map((cat) => {
    if (typeof cat._id === "string") {
      return new mongoose.Types.ObjectId(cat._id);
    }
    return cat._id as Types.ObjectId;
  });
}

// Función para obtener el color hexadecimal basado en el valor de fondo
function getBackgroundColor(backgroundValue: string): string {
  switch (backgroundValue) {
    case "miel":
      return "#FDEFAE"; // hsla(49, 95%, 84%, 1)
    case "rosa":
      return "#FFE7E3"; // hsla(8, 100%, 95%, 1)
    case "verde":
      return "#4EAF00"; // Corregido para ser un color hexadecimal válido
    case "nube":
      return "#D7EDF2"; // hsla(191, 51%, 90%, 1)
    case "patron-1":
      return "#FFF7D2"; // hsla(49, 100%, 91%, 1)
    case "patron-2":
      return "#FFFFFF"; // hsla(0, 0%, 100%, 1)
    default:
      return "#FFFFFF";
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query = {
      $and: [
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
        {
          $or: [{ creator: new mongoose.Types.ObjectId(session.user._id) }],
        },
      ],
    };

    const totalProjects = await Project.countDocuments(query);
    const totalPages = Math.ceil(totalProjects / limit);

    const projects = await Project.find(query)
      .populate("creator", "fullname avatar")
      .populate("categories", "name")
      .populate({
        path: "channels",
        select: "name messages",
        populate: {
          path: "messages",
          select: "content",
        },
      })
      .lean()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      projects,
      currentPage: page,
      totalPages,
      totalProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        error: "Error al recuperar proyectos",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validar datos requeridos
    if (!data.name || !data.visibility) {
      return NextResponse.json(
        { error: "Nombre y visibilidad son campos requeridos" },
        { status: 400 }
      );
    }

    // Simplificamos para usar solo backgroundType 'color' y el color hexadecimal
    const backgroundColor = getBackgroundColor(data.background || "");

    // Crear el nuevo proyecto
    const newProject = new Project({
      name: data.name,
      description: data.description || "",
      creator: new mongoose.Types.ObjectId(session.user._id),
      backgroundType: "color",
      backgroundColor,
      visibility: data.visibility,
    });

    await newProject.save();

    // Crear categorías por defecto para este proyecto
    const defaultCategoryIds = await createDefaultCategories(
      newProject._id as Types.ObjectId,
      session.user._id
    );

    // Actualizar el proyecto con las categorías creadas
    await Project.findByIdAndUpdate(
      newProject._id,
      { categories: defaultCategoryIds },
      { new: true }
    );

    const updatedProject = await Project.findById(newProject._id)
      .populate("creator", "fullname avatar")
      .populate("categories", "name")
      .lean();

    return NextResponse.json(updatedProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Error al crear el proyecto" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { _id, ...data } = await request.json();

    const projectToUpdate = await Project.findById(_id);
    if (
      !projectToUpdate ||
      projectToUpdate.creator.toString() !== session.user._id
    ) {
      return NextResponse.json(
        { error: "No tienes permiso para editar este proyecto" },
        { status: 403 }
      );
    }

    // Si hay un background nuevo, obtener el color hexadecimal
    let backgroundColor = projectToUpdate.backgroundColor;
    if (data.background) {
      backgroundColor = getBackgroundColor(data.background);
    }

    const updateData = {
      ...data,
      backgroundType: "color",
      backgroundColor,
    };

    // Eliminamos los campos que ya no utilizamos
    delete updateData.backgroundGradient;
    delete updateData.backgroundImage;
    delete updateData.background;

    const updatedProject = await Project.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar el proyecto",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { _id } = await request.json();

    // Verify project ownership
    const projectToDelete = await Project.findById(_id);
    if (
      !projectToDelete ||
      projectToDelete.creator.toString() !== session.user._id
    ) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar este proyecto" },
        { status: 403 }
      );
    }

    await Project.findByIdAndDelete(_id);

    return NextResponse.json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar el proyecto",
      },
      { status: 500 }
    );
  }
}