import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    default: "",
  },
  canciones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cancion",
  }],
  creadaPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.model("Playlist", playlistSchema);
