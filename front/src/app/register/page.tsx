"use client";

import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);

      // Enviar datos de registro al backend
      const signupResponse = await axios.post("/api/auth/signup", {
        email: formData.get("email"),
        password: formData.get("password"),
        fullname: formData.get("fullname"),
        avatar: "", // Inicialmente vacío, el usuario puede subir un avatar después
        role: "viewer", // Rol por defecto
        projects: [], // Inicialmente sin proyectos
      });

      console.log(signupResponse);

      // Iniciar sesión automáticamente después del registro
      const res = await signIn("credentials", {
        email: signupResponse.data.email,
        password: formData.get("password"),
        redirect: false,
      });

      if (res?.ok) {
        router.push("/dashboard/profile"); // Redirigir al perfil después del registro
      } else {
        setError("Error al iniciar sesión después del registro");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message || "Error en el registro";
        setError(errorMessage);
      } else {
        setError("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center sm:overflow-hidden overflow-visible">
      {/* <Navbar /> */}

      <div className="relative mt-8 md:mt-18 flex-1 grid grid-cols-1 md:grid-cols-2 max-w-screen-2xl mx-auto">
        {/* Columna Izquierda - Formulario */}
        <div className="relative flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title text-3xl text-primary mb-6">
                  Regístrate
                </h1>

                {/* Mostrar errores */}
                {error && (
                  <div className="bg-red-500 text-white p-2 mb-4 rounded">
                    {error}
                  </div>
                )}

                {/* Botones Sociales */}
                <div className="flex flex-col gap-3">
                  <button
                    className="btn btn-outline gap-2 hover:bg-secondary/20 hover:text-neutral"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard/profile" })}
                  >
                    <img
                      src="/google-icon.svg"
                      className="w-5 h-5"
                      alt="Google"
                    />
                    Continuar con Google
                  </button>

                  <button
                    className="btn btn-outline gap-2 hover:bg-secondary/20 hover:text-neutral"
                    onClick={() => signIn("apple", { callbackUrl: "/dashboard/profile" })}
                  >
                    <img
                      src="/apple-icon.svg"
                      className="w-5 h-5"
                      alt="Apple"
                    />
                    Continuar con Apple
                  </button>
                </div>

                <div className="divider text-primary my-2"></div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-primary font-semibold">
                        Nombre Completo
                      </span>
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Introduce tu nombre completo..."
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-primary font-semibold">
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Introduce tu email..."
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-primary font-semibold">
                        Contraseña
                      </span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Introduce tu contraseña..."
                      className="input input-bordered"
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full mt-8"
                  >
                    Registrarme
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Imagen */}
        <div className="flex relative items-center justify-center">
          <div className="absolute flex items-center justify-center inset-0 -z-10">
            <img
              src="/poligonos-fondo.svg"
              alt="Patrón de fondo"
              className="w-fit h-fit object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xs lg:max-w-md p-8">
            <img
              src="/abejita.svg"
              alt="Ilustración principal"
              className="w-full h-auto animate-float"
            />
          </div>
        </div>

        <div className="absolute flex justify-center sm:-bottom-full bottom-0 sm:inset-0 -z-10">
          <img src="/bee-pattern.svg" alt="Patrón de abejas" />
        </div>
      </div>
    </div>
  );
};

export default Register;