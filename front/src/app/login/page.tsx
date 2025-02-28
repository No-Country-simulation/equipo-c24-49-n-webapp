"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else if (res?.ok) {
      router.push("/dashboard/profile");
    }
  };

  return (
    <div className="h-screen flex justify-center sm:overflow-hidden overflow-visible">
      {/* <Navbar /> */}

      <div className="relative mt-8 md:mt-18 flex-1 grid grid-cols-1 md:grid-cols-2 max-w-screen-2xl mx-auto">
        {/* Columna Izquierda - Formulario */}
        <div className="relative flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title text-3xl text-primary mb-6">
                  Inicia Sesión
                </h1>

                {/* Botones Sociales */}
                <div className="flex flex-col gap-3">
                  <button
                    className="btn btn-outline gap-2 hover:bg-secondary/20 hover:text-neutral"
                    onClick={() => signIn("google")}
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
                    onClick={() => signIn()}
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
                  {error && (
                    <div className="bg-red-500 text-white p-2 mb-4 rounded">
                      {error}
                    </div>
                  )}

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
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full mt-8"
                  >
                    Iniciar Sesión
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

export default Login;