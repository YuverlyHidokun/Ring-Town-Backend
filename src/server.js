import express from "express";
import cors from "cors";

import dotenv from "dotenv";


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

// Ruta 404 para endpoints no encontrados
app.use((req, res) => res.status(404).send("🚫 Endpoint no encontrado - 404"));

export default app;
