import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "imagenes_ringtown",
    allowed_formats: ["jpg", "jpeg", "png"],
    resource_type: "image" // Asegúrate que sea image y no video
  },
});

const parser = multer({ storage });

console.log("✅ Multer configurado con Cloudinary");

export default parser;
