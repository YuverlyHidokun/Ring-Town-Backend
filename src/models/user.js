import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  numero: { 
    type: Number, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  rol: {
    type: String,
    enum: ["usuario", "artista"],
    default: "usuario"
  },
  token: { 
    type: String, 
    default: null 
  },
  confirmEmail: { 
    type: Boolean, 
    default: false 
  },
  imagenUrl: { 
    type: String,
    default: ""
  },
  imagenPublicId: { 
    type: String,
    default: ""
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});


// 🔐 Método para encriptar contraseña
userSchema.methods.encrypPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// 🔐 Método para comparar contraseñas
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// 🔑 Método para generar token de verificación
userSchema.methods.generarToken = function() {
  const tokenGenerado = this.token = Math.random().toString(36).slice(2);
  return tokenGenerado;
};

export default model("Usuario", userSchema);
