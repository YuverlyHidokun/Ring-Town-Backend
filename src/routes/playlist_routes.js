import express from "express";
import verificarAuth from "../middlewares/authmiddleware.js";
import {
  crearPlaylist,
  obtenerPlaylists,
  agregarCancion,
  eliminarCancion,
  eliminarPlaylist,
  editarPlaylist,
  obtenerPlaylistPorId
} from "../controllers/playlist_controller.js";

const router = express.Router();

router.post("/", verificarAuth, crearPlaylist);
router.get("/", verificarAuth, obtenerPlaylists);
router.get("/:id", verificarAuth, obtenerPlaylistPorId);
router.put("/:id", verificarAuth, editarPlaylist);
router.post("/agregar", verificarAuth, agregarCancion);
router.post("/eliminar", verificarAuth, eliminarCancion);
router.delete("/:id", verificarAuth, eliminarPlaylist);

export default router;
