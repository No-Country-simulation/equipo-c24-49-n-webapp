import { NextResponse } from "next/server";
import Comment from "@/models/comment";
import Task from "@/models/task";
import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

const CommentModel = mongoose.model('Comment');
const TaskModel = mongoose.model('Task');

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");
    if (!taskId) return NextResponse.json({ error: "Se requiere taskId" }, { status: 400 });

    const comments = await CommentModel.find({ task: taskId }).populate("author", "fullname avatar").sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Error al recuperar comentarios" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { taskId, content } = await request.json();
    if (!taskId || !content) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });

    const newComment = new Comment({ content, task: taskId, author: session.user._id });
    await newComment.save();

    await TaskModel.findByIdAndUpdate(taskId, { $push: { comments: newComment._id } });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear comentario" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { _id, content } = await request.json();
    if (!_id || !content) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });

    const comment = await CommentModel.findById(_id);
    if (!comment) return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 });

    if (comment.author.toString() !== session.user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    comment.content = content;
    await comment.save();

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar comentario" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { _id } = await request.json();
    if (!_id) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });

    const comment = await CommentModel.findById(_id);
    if (!comment) return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 });

    if (comment.author.toString() !== session.user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await Promise.all([
      CommentModel.findByIdAndDelete(_id),
      TaskModel.findByIdAndUpdate(comment.task, { $pull: { comments: _id } }),
    ]);

    return NextResponse.json({ message: "Comentario eliminado exitosamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar comentario" }, { status: 500 });
  }
}
