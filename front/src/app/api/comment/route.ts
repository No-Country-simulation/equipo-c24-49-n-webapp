// app/api/comments/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Comment, { IComment } from "@/models/comment";
import Task from "@/models/task";
import Project from "@/models/project";
import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/options";

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const taskId = searchParams.get("taskId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!taskId) {
      return NextResponse.json({ error: "Se requiere taskId" }, { status: 400 });
    }

    // Verificar acceso a la tarea
    const task = await Task.findById(taskId)
      .populate({
        path: 'category',
        populate: {
          path: 'project',
          select: 'collaborators'
        }
      });

    if (!task) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }

    const project = (task.category as any).project;
    const hasAccess = project.collaborators.some((c: any) => 
      c.user.toString() === session.user._id
    ) || project.creator.toString() === session.user._id;

    if (!hasAccess) {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    const query = {
      task: taskId,
      content: { $regex: search, $options: "i" }
    };

    const totalComments = await Comment.countDocuments(query);
    const totalPages = Math.ceil(totalComments / limit);

    const comments = await Comment.find(query)
      .populate('author', 'fullname avatar')
      .lean()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit) as IComment[];

    return NextResponse.json({
      comments,
      currentPage: page,
      totalPages,
      totalComments
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ 
      error: "Error al recuperar comentarios" 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { taskId, content } = await request.json();
    
    // Verificar acceso a la tarea
    const task = await Task.findById(taskId)
      .populate({
        path: 'category',
        populate: {
          path: 'project',
          select: 'collaborators'
        }
      });

    if (!task) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }

    const project = (task.category as any).project;
    const hasAccess = project.collaborators.some((c: any) => 
      c.user.toString() === session.user._id
    ) || project.creator.toString() === session.user._id;

    if (!hasAccess) {
      return NextResponse.json({ error: "No tienes permiso para comentar" }, { status: 403 });
    }

    const newComment = new Comment({
      content,
      task: taskId,
      author: session.user._id
    });
    
    await newComment.save();

    // Actualizar tarea con el nuevo comentario
    await Task.findByIdAndUpdate(taskId, {
      $push: { comments: newComment._id }
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ 
      error: "Error al crear el comentario" 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { _id, content } = await request.json();
    
    // Verificar si el usuario es el autor
    const comment = await Comment.findById(_id);
    
    if (!comment) {
      return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 });
    }

    if (comment.author.toString() !== session.user._id) {
      return NextResponse.json({ 
        error: "Solo el autor puede editar este comentario" 
      }, { status: 403 });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      _id, 
      { content },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ 
      error: "Error al actualizar el comentario" 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { _id } = await request.json();
    
    // Verificar permisos
    const comment = await Comment.findById(_id)
      .populate('author', '_id');

    if (!comment) {
      return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 });
    }

    const isAuthor = comment.author._id.toString() === session.user._id;
    const isAdmin = await this.checkProjectAdmin(comment.task, session.user._id);

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ 
        error: "No tienes permiso para eliminar este comentario" 
      }, { status: 403 });
    }

    // Eliminar comentario y su referencia en la tarea
    await Promise.all([
      Comment.findByIdAndDelete(_id),
      Task.findByIdAndUpdate(comment.task, {
        $pull: { comments: _id }
      })
    ]);
    
    return NextResponse.json({ message: "Comentario eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ 
      error: "Error al eliminar el comentario" 
    }, { status: 500 });
  }
}

// Función auxiliar para verificar permisos de administrador
async function checkProjectAdmin(taskId: string, userId: string) {
  const task = await Task.findById(taskId)
    .populate({
      path: 'category',
      populate: {
        path: 'project',
        select: 'creator collaborators'
      }
    });

  const project = (task?.category as any)?.project;
  
  return project?.creator.toString() === userId || 
    project?.collaborators.some((c: any) => 
      c.user.toString() === userId && c.role === 'admin'
    );
}