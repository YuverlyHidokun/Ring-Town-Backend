// routes/cancion_routes.js
import express from "express";
import { 
    subirCancion, 
    obtenerCanciones,
    obtenerCancionesPorArtista,
    eliminarCancion,
    editarCancion,
    buscarPorGenero } from "../controllers/cancion_controller.js";

import verificarAuth  from "../middlewares/authmiddleware.js";
import upload from "../config/multer.js";



const router = express.Router();

router.post("/", verificarAuth, upload.fields([
  { name: "portada", maxCount: 1 },
  { name: "audio", maxCount: 1 }
]), subirCancion);

router.get("/", obtenerCanciones);

router.get("/artista/:id", obtenerCancionesPorArtista);

router.get("/buscar/genero", buscarPorGenero);

router.delete("/:id", verificarAuth, eliminarCancion);

router.put("/:id", verificarAuth, upload.fields([{ name: "portada" }, { name: "audio" }]), editarCancion);

export default router;
