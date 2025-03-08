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
      name: "En Proceso",
      project: projectId,
      creator: creatorId,
      description: "Tareas en desarrollo activo",
    },
    {
      name: "Hecho",
      project: projectId,
      creator: creatorId,
      description: "Tareas completadas",
    },
    {
      name: "En Pausa",
      project: projectId,
      creator: creatorId,
      description: "Tareas temporalmente detenidas",
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

function getBackgroundColor(backgroundValue: string): string {
  switch (backgroundValue) {
    case "miel":
      return "#FDE68A"; // Amarillo dorado
    case "panal":
      return "#FCD34D"; // Amarillo ámbar
    case "nectar":
      return "#FEF3C7"; // Naranja claro
    case "polen":
      return "#FEF9C3"; // Amarillo muy claro
    case "cera":
      return "#FEF9C3"; // Crema claro
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

    // Mapeo de los campos del componente al modelo
    const newProject = new Project({
      name: data.projectName,
      description: "",
      creator: new mongoose.Types.ObjectId(session.user._id),
      backgroundType: "color",
      backgroundColor: data.background
        ? getBackgroundColor(data.background)
        : "#FFFFFF",
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
      {
        error: "Error al crear el proyecto",
      },
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

    const updateData = {
      ...data,
      backgroundType: data.backgroundType || projectToUpdate.backgroundType,
      backgroundColor: data.backgroundColor || projectToUpdate.backgroundColor,
      backgroundGradient: data.backgroundGradient
        ? {
            color1:
              data.backgroundGradient.color1 ||
              projectToUpdate.backgroundGradient?.color1,
            color2:
              data.backgroundGradient.color2 ||
              projectToUpdate.backgroundGradient?.color2,
            angle:
              data.backgroundGradient.angle ||
              projectToUpdate.backgroundGradient?.angle,
          }
        : projectToUpdate.backgroundGradient,
      backgroundImage: data.backgroundImage || projectToUpdate.backgroundImage,
    };

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

