import jwt from "jsonwebtoken";
import Usuario from "../models/user.js"; // Asegúrate que el modelo esté en español si ya lo renombraste

const verificarAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ mensaje: "Token inválido" });
    }
  } else {
    res.status(401).json({ mensaje: "No autorizado, token no enviado" });
  }
};

export default verificarAuth;
