"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { UploadButton } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [imageUrl, setImageUrl] = useState<string | null>(user?.avatar || null);

  const saveAvatar = (imageUrl: string) => {
    const promise = new Promise((resolve, reject) => {
      fetch("/api/update-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, avatar: imageUrl }),
      })
        .then(async (response) => {
          if (!response.ok)
            throw new Error("Error al guardar la imagen en la base de datos");

          await update({ avatar: imageUrl });
          router.refresh();
          setImageUrl(imageUrl);

          resolve("Avatar actualizado con éxito");
        })
        .catch((error) => {
          console.error(error);
          reject();
        });
    });

    toast.promise(promise, {
      loading: "Actualizando avatar...",
      success: "Avatar actualizado con éxito",
      error: "No se pudo actualizar la imagen",
    });
  };

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="card bg-base-100 shadow-xl w-full max-w-2xl">
          <div className="mx-auto skeleton h-6 w-64 py-2"></div>

          <div className="card-body flex flex-col md:flex-row gap-8 ">
            <div className="flex-1 space-y-4">
              <div>
                <label className="label">
                  <div className="skeleton h-4 w-12 py-2"></div>
                </label>
                <div className="skeleton h-4 w-28"></div>
              </div>
              <div>
                <label className="label">
                  <div className="skeleton h-4 w-12 py-2"></div>
                </label>
                <div className="skeleton h-4 w-28"></div>
              </div>
              <div>
                <label className="label">
                  <div className="skeleton h-4 w-12 py-2"></div>
                </label>
                <div className="skeleton h-4 w-28"></div>
              </div>
              <div className="skeleton h-4 w-28"></div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="skeleton h-48 w-48 shrink-0 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="card bg-base-100 shadow-xl w-full max-w-2xl">
          <h1 className="card-title mx-auto text-3xl text-primary mb-2">
            Perfil de Usuario
          </h1>

          <div className="card-body flex flex-col md:flex-row gap-8 ">
            <div className="flex-1 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text text-primary font-semibold">
                    Nombre Completo
                  </span>
                </label>
                <p className="text-neutral-700">
                  {user?.name || user?.fullname}
                </p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-primary font-semibold">
                    Email
                  </span>
                </label>
                <p className="text-neutral-700">{user?.email}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-primary font-semibold">
                    Rol
                  </span>
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

            <div className="flex flex-col items-center gap-4">
              <img
                src={user?.avatar || imageUrl || "/user-icon.svg"}
                alt="Imagen de perfil"
                className="w-48 h-48 rounded-full object-cover border-4 border-primary"
              />
              <div className="mt-4">
                <UploadButton
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
