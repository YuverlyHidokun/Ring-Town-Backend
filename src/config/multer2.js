// middleware/uploadAudio.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "canciones_ringtown",
    resource_type: "video", // Cloudinary usa 'video' para archivos grandes (audio/video)
    allowed_formats: ["mp3", "wav", "ogg"],
  },
});

const audioParser = multer({ storage: audioStorage });

export default audioParser;
