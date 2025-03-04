import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project, { IProject } from "@/models/project";
import { connectDB } from "@/libs/mongodb";

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";

  try {
    // Conversión explícita con .lean() y tipado
    const projects = await Project.find<IProject>({
      name: { $regex: search, $options: "i" },
    })
    .lean() // Convierte los documentos a objetos planos
    .sort(sort) as IProject[];

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ 
      error: "Error al recuperar proyectos" 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const newProject = new Project(data);
  await newProject.save();
  return NextResponse.json(newProject);
}

export async function PUT(request: Request) {
  await connectDB();
  const { _id, ...data } = await request.json();
  const updatedProject = await Project.findByIdAndUpdate(_id, data, { new: true });
  return NextResponse.json(updatedProject);
}

export async function DELETE(request: Request) {
  await connectDB();
  const { _id } = await request.json();
  await Project.findByIdAndDelete(_id);
  return NextResponse.json({ message: "Project deleted successfully" });
}