import Cancion from "../models/song.js";
import { v2 as cloudinary } from "cloudinary";
import util from "util";

const subirCancion = async (req, res) => {
  try {
    // Loguea todo el body y los archivos
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { titulo, genero } = req.body;
    const usuarioId = req.usuario?._id;

    // Verifica usuario
    if (!usuarioId) {
      return res.status(401).json({ msg: "Usuario no autenticado" });
    }

    // Verifica archivos
    const audioFile = req.files?.audio?.[0];
    const portadaFile = req.files?.portada?.[0];

    console.log("audioFile:", audioFile);
    console.log("portadaFile:", portadaFile);

    if (!audioFile || !portadaFile) {
      return res.status(400).json({ msg: "Audio y portada son requeridos" });
    }

    // Crea la canción
    const nuevaCancion = new Cancion({
      titulo,
      artista: req.usuario.nombre + " " + req.usuario.apellido,
      genero,
      portadaUrl: portadaFile.path,
      portadaPublicId: portadaFile.filename,
      audioUrl: audioFile.path,
      audioPublicId: audioFile.filename,
      subidaPor: usuarioId,
    });

    await nuevaCancion.save();

    res.status(201).json({
      msg: "Canción subida correctamente",
      cancion: nuevaCancion,
    });
  } catch (error) {
    // Log detallado del error
    console.error("❌ Error al subir canción:", util.inspect(error, { depth: null }));
    res.status(500).json({
      msg: "Error al subir canción",
      error: error?.message || String(error),
      stack: error?.stack || String(error),
      details: util.inspect(error, { depth: null })
    });
  }
};

// 📌 Obtener todas las canciones
const obtenerCanciones = async (req, res) => {
  try {
    const canciones = await Cancion.find()
      .populate("artista", "nombre apellido email rol") // 👈 Para mostrar el autor/artista
      .sort({ createdAt: -1 });

    res.json(canciones);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener canciones" });
  }
};

// 📌 Obtener canciones por ID del artista (usuario)
const obtenerCancionesPorArtista = async (req, res) => {
  const { id } = req.params;
  try {
    const canciones = await Cancion.find({ subidaPor: id }).sort({ createdAt: -1 });
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener canciones del artista" });
  }
};

const eliminarCancion = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario._id;

  try {
    const cancion = await Cancion.findById(id);

    if (!cancion) return res.status(404).json({ msg: "Canción no encontrada" });

    if (cancion.subidaPor.toString() !== usuarioId.toString()) {
      return res.status(403).json({ msg: "No autorizado para eliminar esta canción" });
    }

    // Eliminar archivos de Cloudinary
    await cloudinary.uploader.destroy(cancion.portadaPublicId);
    await cloudinary.uploader.destroy(cancion.audioPublicId, { resource_type: "video" });

    await cancion.deleteOne();

    res.json({ msg: "Canción eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar la canción" });
  }
};

const editarCancion = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario._id;
  const { titulo, genero } = req.body;

  try {
    const cancion = await Cancion.findById(id);
    if (!cancion) return res.status(404).json({ msg: "Canción no encontrada" });

    if (cancion.subidaPor.toString() !== usuarioId.toString()) {
      return res.status(403).json({ msg: "No autorizado para editar esta canción" });
    }

    // Actualizar campos
    if (titulo) cancion.titulo = titulo;
    if (genero) cancion.genero = genero;

    // Si llega nueva portada
    if (req.files?.portada?.[0]) {
      await cloudinary.uploader.destroy(cancion.portadaPublicId);
      const nuevaPortada = await cloudinary.uploader.upload(req.files.portada[0].path, {
        folder: "portadas_ringtown"
      });
      cancion.portadaUrl = nuevaPortada.secure_url;
      cancion.portadaPublicId = nuevaPortada.public_id;
    }

    // Si llega nuevo audio
    if (req.files?.audio?.[0]) {
      await cloudinary.uploader.destroy(cancion.audioPublicId, { resource_type: "video" });
      const nuevoAudio = await cloudinary.uploader.upload(req.files.audio[0].path, {
        folder: "audios_ringtown",
        resource_type: "video"
      });
      cancion.audioUrl = nuevoAudio.secure_url;
      cancion.audioPublicId = nuevoAudio.public_id;
    }

    await cancion.save();
    res.json({ msg: "Canción actualizada correctamente", cancion });
  } catch (error) {
    console.error("❌ Error al editar canción:", error);
    res.status(500).json({ msg: "Error al editar canción" });
  }
};

// 📌 Buscar canciones por género
const buscarPorGenero = async (req, res) => {
  const { genero } = req.query;

  try {
    if (!genero) return res.status(400).json({ msg: "El género es requerido" });

    const canciones = await Cancion.find({
      genero: { $regex: new RegExp(genero, "i") } // búsqueda insensible a mayúsculas
    }).sort({ createdAt: -1 });

    res.json(canciones);
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar canciones por género" });
  }
};

export { 
    subirCancion, 
    obtenerCanciones,
    obtenerCancionesPorArtista,
    eliminarCancion,
    editarCancion,
    buscarPorGenero
 };
