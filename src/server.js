import express from "express";
import cors from "cors";

import dotenv from "dotenv";

import userRoutes from "./routes/user_routes.js";
import musicRoutes from "./routes/cancion_routes.js"; // <-- Importa las rutas de música
import playlistRoutes from "./routes/playlist_routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🎵 API Ring Town funcionando🎶");
});

// Rutas
app.use("/music/usuarios", userRoutes);
app.use("/music/canciones", musicRoutes);
app.use("/music/playlists", playlistRoutes);

// Ruta 404 para endpoints no encontrados
app.use((req, res) => res.status(404).send("🚫 Endpoint no encontrado - 404"));
app.use((err, req, res, next) => {
  console.error("💥 Error global:", err, err?.message, err?.stack);
  res.status(500).json({
    msg: "Error interno del servidor",
    error: err?.message || String(err),
    stack: err?.stack || String(err)
  });
});

export default app;