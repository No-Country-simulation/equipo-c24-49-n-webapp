
// Función para subir la imagen y actualizar el avatar del usuario
export async function uploadAndSaveAvatar(ev, email: string) {
  const file = ev.target.files?.[0];

  if (!file) return;
    try {
      // Subir la imagen a UploadThing
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await fetch("/api/uploadthing", {
        method: "POST",
        body: formData,
      });
      const responseText = await uploadResponse.text(); // Obtener la respuesta como texto

      if (!uploadResponse.ok) {
        console.error("Error en /api/uploadthing:", responseText);
        throw new Error(`Error al subir la imagen: ${responseText}`);
      }
      const { link } = await uploadResponse.json(); // Obtener la URL de la imagen subida

      // Guardar la URL en la base de datos
      const saveResponse = await fetch("/api/update-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, avatar: link }),
      });

      if (!saveResponse.ok) throw new Error("Error al guardar el avatar");

    } catch (error) {
      console.log(error)
    }
  ;

}

