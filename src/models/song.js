import mongoose from "mongoose";

const cancionSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    artista: {
      type: String,
      required: true,
    },
    genero: {
      type: String,
      required: true,
    },
    portadaUrl: {
      type: String,
      default: "",
    },
    portadaPublicId: {
      type: String,
      default: "",
    },
    audioUrl: {
      type: String,
      required: true,
    },
    audioPublicId: {
      type: String,
      required: true,
    },
    subidaPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cancion", cancionSchema);
