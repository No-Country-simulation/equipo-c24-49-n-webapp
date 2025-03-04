import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project, { IProject } from "@/models/project";
import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/options";

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
            { description: { $regex: search, $options: "i" } }
          ]
        },
        {
          $or: [
            { creator: new mongoose.Types.ObjectId(session.user._id) },
            { channels: { $elemMatch: { $in: session.user.projects } } }
          ]
        }
      ]
    };

    const totalProjects = await Project.countDocuments(query);
    const totalPages = Math.ceil(totalProjects / limit);

    const projects = await Project.find(query)
      .populate('creator', 'fullname avatar')
      .populate('categories', 'name')
      .populate('channels', 'name')
      .lean()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit) as IProject[];

    return NextResponse.json({
      projects,
      currentPage: page,
      totalPages,
      totalProjects
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ 
      error: "Error al recuperar proyectos" 
    }, { status: 500 });
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
    const newProject = new Project({
      ...data,
      creator: session.user._id
    });
    
    await newProject.save();
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ 
      error: "Error al crear el proyecto" 
    }, { status: 500 });
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
    
    // Verify project ownership
    const projectToUpdate = await Project.findById(_id);
    if (!projectToUpdate || projectToUpdate.creator.toString() !== session.user._id) {
      return NextResponse.json({ error: "No tienes permiso para editar este proyecto" }, { status: 403 });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      _id, 
      data, 
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ 
      error: "Error al actualizar el proyecto" 
    }, { status: 500 });
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
    if (!projectToDelete || projectToDelete.creator.toString() !== session.user._id) {
      return NextResponse.json({ error: "No tienes permiso para eliminar este proyecto" }, { status: 403 });
    }

    await Project.findByIdAndDelete(_id);
    
    return NextResponse.json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ 
      error: "Error al eliminar el proyecto" 
    }, { status: 500 });
  }
}