import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/models/project";
import { connectDB } from "@/libs/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    let projectId;
    try {
      projectId = new mongoose.Types.ObjectId(id);
    } catch (err) {
      console.log(err)
      return NextResponse.json(
        { error: "ID de proyecto inválido" },
        { status: 400 },

      );
    }

    const project = await Project.findById(projectId)
      .populate({
        path: "categories",
        select: "name tasks",
        populate: {
          path: "tasks",
          select: "title description priority status",
        },
      })
      .populate({
        path: "channels",
        select: "name messages",
      })
      .populate("creator", "fullname avatar");
      console.log(project)
      // console.log(project?.categories[0]?.tasks)
    if (!project) {
      
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error al recuperar el proyecto:", error);
    return NextResponse.json(
      { error: "Error al recuperar el proyecto" },
      { status: 500 }
    );
  }
}
