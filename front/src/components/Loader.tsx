"use client";

// import Lottie from "lottie-react";
// import loaderAnimation from "../../public/loader8.json"; // Asegúrate de colocar el JSON en la carpeta `public`

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
  </div>
  );
};

export default Loader;
