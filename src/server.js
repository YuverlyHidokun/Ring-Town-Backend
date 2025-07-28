import express from "express";
import cors from "cors";

import dotenv from "dotenv";

import userRoutes from "./routes/user_routes.js";
import musicRoutes from "./routes/cancion_routes.js"; // <-- Importa las rutas de música
import playlistRoutes from "./routes/playlist_routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.URL_FRONTEND || 'http://localhost:8100',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // si usas cookies o autenticación, sino false o elimina esta línea
}));

// Esto es importante para responder bien al preflight OPTIONS
app.options('*', cors());

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

export default app;