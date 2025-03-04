"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { UploadButton } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthAwareLayout"; 

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Usar directamente la información del usuario del contexto
  const userImage = user?.avatar || "/user-icon.svg";

  // Manejar el guardado de la imagen en la base de datos
  const saveAvatar = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/update-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, avatar: imageUrl }),
      });

      if (!response.ok) throw new Error("Error al guardar la imagen en la base de datos");

      toast.success("Avatar actualizado con éxito");
      setImageUrl(imageUrl);
    } catch (error) {
      toast.error("No se pudo guardar la imagen");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="card bg-base-100 shadow-lg w-full max-w-2xl">
          <h1 className="card-title mx-auto text-3xl text-primary mb-2">Perfil de Usuario</h1>

          <div className="card-body flex flex-col md:flex-row gap-8">
            {/* Información del usuario */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text text-primary font-semibold">Nombre Completo</span>
                </label>
                <p className="text-neutral-700">{user?.name || user?.fullname}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-primary font-semibold">Email</span>
                </label>
                <p className="text-neutral-700">{user?.email}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-primary font-semibold">Rol</span>
                </label>
                <p className="text-neutral-700">{user?.role || "Usuario"}</p>
              </div>
              <button
                onClick={() => {
                  signOut();
                  router.push("/login");
                }}
              >
                Cerrar sesión
              </button>
            </div>
            {/* Imagen de perfil */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={userImage}
                alt="Imagen de perfil"
                className="w-48 h-48 rounded-full object-cover border-4 border-primary"
              />
              <div className="mt-4">
                {/* Botón de UploadThing */}
                <UploadButton
                  className="bg-red-200"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      saveAvatar(res[0].url);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Error al subir la imagen: ${error.message}`);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;