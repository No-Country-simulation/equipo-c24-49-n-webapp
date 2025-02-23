import Navbar from "@/components/Navbar";

const Register = () => {
  return (
    <div className="min-h-screen sm:overflow-hidden overflow-visible ">
      <Navbar />

      <div className="relative mt-8 md:mt-18 flex-1 grid grid-cols-1 md:grid-cols-2 max-w-screen-2xl mx-auto ">
        {/* Columna Izquierda - Formulario */}
        <div className="relative flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title text-3xl text-primary mb-6">
                  Regístrate
                </h1>

                {/* Botones Sociales */}
                <div className="flex flex-col gap-3">
                  <button className="btn btn-outline gap-2 hover:bg-secondary/20 hover:text-neutral">
                    <img
                      src="/google-icon.svg"
                      className="w-5 h-5"
                      alt="Google"
                    />
                    Continuar con Google
                  </button>

                  <button className="btn btn-outline gap-2 hover:bg-secondary/20 hover:text-neutral">
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
                <form className="">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-primary font-semibold">
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="Introduce tu email..."
                      className="input input-bordered "
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
                      placeholder="Introduce tu contraseña..."
                      className="input  input-bordered"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full mt-8 "
                  >
                    Registrarme
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Columna derecha - Imagen */}
        <div className=" flex relative items-center justify-center">
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
          <img src="/bee-pattern.svg" className=" "></img>
        </div>
      </div>
    </div>
  );
};

export default Register;
