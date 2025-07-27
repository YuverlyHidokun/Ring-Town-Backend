import express from "express";
import multer from "multer";
import {
  registro,
  login,
  verificarCuenta,
  recuperarPassword,
  comprobarTokenPasword,
  nuevoPassword,
  actualizarPassword,
  obtenerPerfil,
  actualizarPerfil,
  actualizarImagenPerfil
} from "../controllers/user_controller.js";
import verificarAuth  from "../middlewares/authmiddleware.js";

import upload from "../config/multer.js";


const router = express.Router();

// Configuración de Multer (subida de imágenes)
router.post("/registro", upload.single("imagen"), registro);


router.post("/login", login);
router.get("/verificar/:token", verificarCuenta);

router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/recuperar-password/:token", nuevoPassword);

// 🟡 Rutas protegidas (requieren JWT)
router.get("/perfil", verificarAuth, obtenerPerfil);
router.put("/actualizar-perfil", verificarAuth, actualizarPerfil);
router.put("/actualizar-imagen", verificarAuth, upload.single("imagen"), actualizarImagenPerfil);
router.put("/actualizar-password", verificarAuth, actualizarPassword);

export default router;
