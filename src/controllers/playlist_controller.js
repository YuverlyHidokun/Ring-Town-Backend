import Playlist from "../models/playlist.js";

// Crear playlist
const crearPlaylist = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const usuarioId = req.usuario._id;

    const nueva = new Playlist({
      nombre,
      descripcion,
      creadaPor: usuarioId,
    });

    await nueva.save();
    res.status(201).json({ msg: "Playlist creada correctamente", playlist: nueva });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear playlist", error: error.message });
  }
};

// Obtener playlists del usuario
const obtenerPlaylists = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    const playlists = await Playlist.find({ creadaPor: usuarioId }).populate("canciones");
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener playlists" });
  }
};

// Agregar canción a playlist
const agregarCancion = async (req, res) => {
  try {
    const { playlistId, cancionId } = req.body;

    // Validar que los IDs sean ObjectId válidos
    if (!playlistId || !cancionId) {
      return res.status(400).json({ msg: "playlistId y cancionId son requeridos" });
    }
    if (!/^[a-fA-F0-9]{24}$/.test(playlistId) || !/^[a-fA-F0-9]{24}$/.test(cancionId)) {
      return res.status(400).json({ msg: "IDs inválidos" });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ msg: "Playlist no encontrada" });

    // Evitar duplicados (comparar como string, ignorando nulos)
    const existe = playlist.canciones.some(
      id => id && id.toString() === cancionId
    );
    if (existe) {
      return res.status(400).json({ msg: "La canción ya está en la playlist" });
    }

    playlist.canciones.push(cancionId);
    await playlist.save();

    res.json({ msg: "Canción agregada a playlist", playlist });
  } catch (error) {
    console.error("Error al agregar canción:", error);
    res.status(500).json({ msg: "Error al agregar canción", error: error.message });
  }
};

// Eliminar canción de playlist
const eliminarCancion = async (req, res) => {
  try {
    const { playlistId, cancionId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ msg: "Playlist no encontrada" });

    playlist.canciones = playlist.canciones.filter(id => id.toString() !== cancionId);
    await playlist.save();

    res.json({ msg: "Canción eliminada de playlist", playlist });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar canción", error: error.message });
  }
};

// Eliminar playlist
const eliminarPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario._id;

    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ msg: "Playlist no encontrada" });

    if (playlist.creadaPor.toString() !== usuarioId.toString()) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    await playlist.deleteOne();
    res.json({ msg: "Playlist eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar playlist" });
  }
};

// 📌 Editar nombre y descripción de la playlist
const editarPlaylist = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario._id;
  const { nombre, descripcion } = req.body;

  try {
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ msg: "Playlist no encontrada" });
    }

    if (playlist.creadaPor.toString() !== usuarioId.toString()) {
    return res.status(403).json({ msg: "No autorizado para editar esta playlist" });
    }


    if (nombre) playlist.nombre = nombre;
    if (descripcion !== undefined) playlist.descripcion = descripcion;

    await playlist.save();

    res.json({
      msg: "Playlist actualizada correctamente",
      playlist,
    });
  } catch (error) {
    console.error("❌ Error al editar playlist:", error);
    res.status(500).json({ msg: "Error al editar playlist" });
  }
};

// Obtener una playlist por ID (con todas sus canciones)
const obtenerPlaylistPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id)
      .populate("canciones")
      .populate("creadaPor", "nombre email"); // opcional: incluir nombre y email del creador

    if (!playlist) {
      return res.status(404).json({ msg: "Playlist no encontrada" });
    }

    res.json(playlist);
  } catch (error) {
    console.error("❌ Error al obtener playlist por ID:", error);
    res.status(500).json({ msg: "Error al obtener playlist" });
  }
};

export {
  crearPlaylist,
  obtenerPlaylists,
  agregarCancion,
  eliminarCancion,
  eliminarPlaylist,
  editarPlaylist,
  obtenerPlaylistPorId
};
