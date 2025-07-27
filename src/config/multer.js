// config/multerUnified.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Configuración para imágenes (portada)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === "portada") {
      return {
        folder: "imagenes_ringtown",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png"],
      };
    }

    // Audio
    if (file.fieldname === "audio") {
      return {
        folder: "canciones_ringtown",
        resource_type: "video", // Cloudinary usa 'video' para audio también
        allowed_formats: ["mp3", "wav", "ogg"],
      };
    }

    // Campo inesperado
    throw new Error("Campo no soportado: " + file.fieldname);
  },
});

const upload = multer({ storage: imageStorage });

export default upload;
