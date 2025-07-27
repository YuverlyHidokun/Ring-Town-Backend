import Usuario from "../models/user.js";
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import generarJWT from "../utils/generateToken.js";
import { v2 as cloudinary } from 'cloudinary';

// 📌 REGISTRO DE USUARIO
const registro = async (req, res) => {
  try {
    const { nombre, apellido, numero, email, password, acepta_terminos } = req.body;

    if (!nombre || !apellido || !numero || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    if (acepta_terminos === "false") {
      return res.status(400).json({ msg: "Debe aceptar los términos y condiciones" });
    }

    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ msg: "Este email ya está registrado" });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      numero,
      email,
      password,
    });

    if (req.file) {
      nuevoUsuario.imagenUrl = req.file.path;      // URL completa de la imagen en Cloudinary
      nuevoUsuario.imagenPublicId = req.file.filename; // ID público de la imagen
    } else {
      console.log("⚠️ No se subió ninguna imagen.");
    }

    nuevoUsuario.token = nuevoUsuario.generarToken();
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password);

    await nuevoUsuario.save();

    await sendMailToRegister(email, nuevoUsuario.token);
    console.log("✅ Correo enviado a:", email);

    res.status(201).json({
      msg: "Cuenta creada. Verifica tu correo electrónico.",
      id_usuario: nuevoUsuario._id,
      token: nuevoUsuario.token,
    });
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ msg: "Error al registrar el usuario" });
  }
};
// 📌 LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].includes("")) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  const usuarioBDD = await Usuario.findOne({ email });
  if (!usuarioBDD) return res.status(404).json({ msg: "Usuario no encontrado" });

  const passwordValido = await usuarioBDD.matchPassword(password);
  if (!passwordValido) return res.status(401).json({ msg: "Contraseña incorrecta" });

  if (!usuarioBDD.confirmEmail) {
    return res.status(403).json({ msg: "Debes confirmar tu cuenta antes de iniciar sesión" });
  }

  const token = generarJWT(usuarioBDD._id);

  res.status(200).json({
    id: usuarioBDD._id,
    nombre: usuarioBDD.nombre,
    email: usuarioBDD.email,
    rol: usuarioBDD.rol,
    token
  });
};

// 📌 VERIFICAR CUENTA
const verificarCuenta = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ token });
  if (!usuario) {
    return res.status(404).json({ msg: "Token inválido o usuario no encontrado" });
  }

  usuario.confirmEmail = true;
  usuario.token = null;
  await usuario.save();

  return res.status(200).json({ msg: "Cuenta verificada correctamente" });
};


// 📌 RECUPERAR CONTRASEÑA
const recuperarPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: "Debes ingresar tu email" });

  const usuario = await Usuario.findOne({ email });
  if (!usuario) return res.status(404).json({ msg: "Email no registrado" });

  usuario.token = usuario.generarToken();
  await usuario.save();

  await sendMailToRecoveryPassword(email, usuario.token);

  res.status(200).json({ msg: "Revisa tu correo electrónico para recuperar tu contraseña" });
};

// 📌 COMPROBAR TOKEN
const comprobarTokenPasword = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ token });
  if (!usuario) {
    return res.redirect(`${process.env.URL_FRONTEND}login?reset=invalid`);
  }

  return res.redirect(`${process.env.URL_FRONTEND}recuperar-password/?token=${encodeURIComponent(token)}&valid=true`);
};

// 📌 CAMBIAR CONTRASEÑA
const nuevoPassword = async (req, res) => {
  const { password, confirmpassword } = req.body;
  const { token } = req.params;

  if ([password, confirmpassword].includes("")) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ msg: "Las contraseñas no coinciden" });
  }

  const usuario = await Usuario.findOne({ token });
  if (!usuario) return res.status(404).json({ msg: "Token inválido o expirado" });

  usuario.token = null;
  usuario.password = await usuario.encrypPassword(password);
  await usuario.save();

  res.status(200).json({ msg: "Contraseña actualizada correctamente" });
};
// Actualizar contraseña desde perfil
const actualizarPassword = async (req, res) => {
  const { id, nuevopassword, confirmarpassword } = req.body;

  const usuario = await Usuario.findById(id);
  if (!usuario) {
    return res.status(404).json({ msg: "Usuario no encontrado" });
  }

  if (nuevopassword !== confirmarpassword) {
    return res.status(400).json({ msg: "Las contraseñas no coinciden" });
  }

  usuario.password = await usuario.encrypPassword(nuevopassword);
  await usuario.save();

  res.status(200).json({ msg: "Contraseña actualizada correctamente" });
};


// 📌 OBTENER PERFIL
const obtenerPerfil = (req, res) => {
  res.json(req.usuario); // el middleware ya puso el usuario
};

// 📌 ACTUALIZAR PERFIL
const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    const { nombre, apellido, numero, email } = req.body;

    usuario.nombre = nombre || usuario.nombre;
    usuario.apellido = apellido || usuario.apellido;
    usuario.numero = numero || usuario.numero;
    usuario.email = email || usuario.email;

    await usuario.save();
    res.json({ msg: "Perfil actualizado", usuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar perfil" });
  }
};

// 📌 ACTUALIZAR IMAGEN DE PERFIL
const actualizarImagenPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    if (usuario.imagenPublicId) {
      await cloudinary.uploader.destroy(usuario.imagenPublicId);
    }

    const file = req.file;

    if (!file || (!file.path && !file.secure_url)) {
      return res.status(400).json({ msg: "No se recibió ninguna imagen válida" });
    }

    usuario.imagenUrl = file.path || file.secure_url;
    usuario.imagenPublicId = file.filename || file.public_id;

    await usuario.save();

    res.json({
      msg: "Imagen de perfil actualizada correctamente",
      usuario: {
        nombre: usuario.nombre,
        imagenUrl: usuario.imagenUrl
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar imagen de perfil" });
  }
};

export {
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
}