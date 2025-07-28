import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Configuración para imágenes y audio
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // Imagen de perfil (registro)
    if (file.fieldname === "imagen") {
      return {
        folder: "usuarios_ringtown",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png"],
      };
    }

    // Portada de canción
    if (file.fieldname === "portada") {
      return {
        folder: "imagenes_ringtown",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png"],
      };
    }

    // Audio de canción
    if (file.fieldname === "audio") {
      return {
        folder: "canciones_ringtown",
        resource_type: "video", // para Cloudinary, mp3 es tipo 'video'
        allowed_formats: ["mp3", "wav", "ogg"],
      };
    }

    // Campo desconocido
    throw new Error("Campo no soportado: " + file.fieldname);
  },
});

const upload = multer({ storage: imageStorage });

export default upload;
