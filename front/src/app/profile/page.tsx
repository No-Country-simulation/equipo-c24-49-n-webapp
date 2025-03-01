"use client";

import { UploadButton } from "@/utils/uploadthing";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from 'react-hot-toast';

const ProfilePage = () => {
  // Obtener la sesión del usuario
  const { data: session, status } = useSession();
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Estado para la URL de la imagen

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    return (
      <p>
        No has iniciado sesión. Por favor, inicia sesión para ver tu perfil.
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="card bg-base-100 shadow-lg w-full max-w-md">
          <div className="card-body">
            <h1 className="card-title text-3xl text-primary mb-6">
              Perfil de Usuario
            </h1>

            {/* Mostrar los datos del usuario */}
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text text-primary font-semibold">
                    Nombre Completo
                  </span>
                </label>
                <p className="text-neutral-700">{session.user?.name}</p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-primary font-semibold">
                    Email
                  </span>
                </label>
                <p className="text-neutral-700">{session.user?.email}</p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-primary font-semibold">
                    Rol
                  </span>
                </label>
                {/* @ts-ignore */}
                <p className="text-neutral-700">
                  {session.user?.role || "Usuario"}
                </p>
              </div>

              {/* Mostrar la imagen recién subida */}
              {imageUrl && (
                <div>
                  <label className="label">
                    <span className="label-text text-primary font-semibold">
                      Imagen Subida
                    </span>
                  </label>
                  <img
                    src={imageUrl}
                    alt="Imagen subida"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}

              {/* Botón de subida de imágenes */}
              <div className="mt-6">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Obtener la URL de la imagen recién subida
                    if (res && res.length > 0) {
                      setImageUrl(res[0].url); // Actualizar el estado con la URL de la imagen
                      toast.success("Subida completada");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`ERROR! ${error.message}`);
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