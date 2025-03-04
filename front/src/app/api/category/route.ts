import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Category, { ICategory } from "@/models/category";
import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/options";
import Project from "@/models/project";

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Validate projectId
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "ID de proyecto inválido" }, { status: 400 });
    }

    const project = await Project.findById(projectId);
    if (!project || project.creator.toString() !== session.user._id) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    const query = {
      project: new mongoose.Types.ObjectId(projectId),
      name: { $regex: search, $options: "i" }
    };

    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);

    const categories = await Category.find(query)
      .populate('tasks')
      .lean()
      .skip((page - 1) * limit)
      .limit(limit) as ICategory[];

    return NextResponse.json({
      categories,
      currentPage: page,
      totalPages,
      totalCategories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ 
      error: "Error al recuperar categorías" 
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

    const { projectId, ...data } = await request.json();

    // Validate projectId
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "ID de proyecto inválido" }, { status: 400 });
    }

    const project = await Project.findById(projectId);
    
    if (!project || project.creator.toString() !== session.user._id) {
      return NextResponse.json({ error: "Proyecto no válido" }, { status: 400 });
    }

    const newCategory = new Category({
      ...data,
      project: new mongoose.Types.ObjectId(projectId)
    });
    
    await newCategory.save();
    project.categories.push(newCategory._id);
    await project.save();
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ 
      error: "Error al crear la categoría" 
    }, { status: 500 });
  }
}

// Resto de los métodos (PUT, DELETE) quedan igual