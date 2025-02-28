"use client";

import { useSession } from "next-auth/react";

const ProfilePage = () => {
  // Obtener la sesión del usuario
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    return <p>No has iniciado sesión. Por favor, inicia sesión para ver tu perfil.</p>;
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
                <p className="text-neutral-700">{session.user?.role || "Usuario"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;