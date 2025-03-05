import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/models/project";
import { connectDB } from "@/libs/mongodb";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const project = await Project.findById(params.id)
      .populate({
        path: 'categories',
        select: 'name tasks',
        populate: {
          path: 'tasks',
          select: 'title'
        }
      })
      .populate({
        path: 'channels',
        select: 'name messages'
      });

    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Error al recuperar el proyecto" },
      { status: 500 }
    );
  }
}