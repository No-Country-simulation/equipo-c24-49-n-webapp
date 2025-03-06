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
          select: "title",
        },
      })
      .populate({
        path: "channels",
        select: "name messages",
      })
      .populate("creator", "fullname avatar");

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

/**
 * @swagger
 * api/projects/{id}:
 *   get:
 *     summary: Obtiene un proyecto por ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto a obtener
 *     responses:
 *       200:
 *         description: Proyecto obtenido exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al recuperar el proyecto
 *
 */
