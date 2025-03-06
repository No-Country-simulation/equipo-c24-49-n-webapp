'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MoreVertical, Plus, UserPlus, ListPlus } from "lucide-react";

interface Task {
    id: string;
    content: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

interface ProjectDetails {
    _id: string;
    name: string;
    categories: {
        _id: string;
        name: string;
        tasks: Array<{ _id: string; title: string }>;
    }[];
}

export default function ProjectBoard() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProject() {
            try {
                const response = await fetch(`/api/projects/${id}`);
                if (!response.ok) throw new Error('Proyecto no encontrado');
                const data = await response.json();
                setProject(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProject();
    }, [id]);

    const transformCategoriesToColumns = (): Column[] => {
        if (!project) return [];

        return project.categories.map(category => ({
            id: category._id,
            title: category.name,
            tasks: category.tasks.map(task => ({
                id: task._id,
                content: task.title
            }))
        }));
    };

    const addNewTask = (columnId: string) => {
        // Lógica para añadir nueva tarea
        console.log(`Añadir nueva tarea a ${columnId}`);
    };

    const addNewCategory = () => {
        // Lógica para añadir nueva categoría
        console.log("Añadir nueva lista de tareas");
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
                <div className="h-10 bg-gray-200 rounded w-1/4 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 bg-gray-100 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="bg-[#5a3d2b] text-white px-4 py-2 rounded-lg hover:bg-[#4a3527] transition"
                >
                    Volver al dashboard
                </button>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
            

            <div className="flex flex-row justify-between  items-start mb-8">
                <div className='flex flex-col gap-8'>
                    <h1 className="text-2xl font-medium text-gray-800">{project.name}</h1>
                    <button
                        onClick={addNewCategory}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                        <ListPlus size={18} className="text-red-400" />
                        <span>Añadir lista de tareas</span>
                    </button>
                </div>
                <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                    <UserPlus size={18} className="text-red-400" />
                    <span>Añadir un miembro</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {transformCategoriesToColumns().map((column) => (
                    <div key={column.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-medium text-gray-800">{column.title}</h2>
                            <button className="text-gray-500 hover:text-gray-700">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 mb-4">
                            {column.tasks.map((task) => (
                                <div key={task.id} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    {task.content}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => addNewTask(column.id)}
                            className="flex items-center gap-2 text-sm w-full justify-center py-2 text-gray-500 hover:text-gray-700"
                        >
                            <Plus size={18} className="text-red-400" />
                            <span>Añadir una nueva tarea</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}