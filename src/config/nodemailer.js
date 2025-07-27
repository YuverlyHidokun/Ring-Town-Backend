import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

// Configurar el transporter con Mailtrap, Gmail o lo que estés usando
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
  }
});

// 📧 Correo de verificación de cuenta
export const sendMailToRegister = (userMail, token) => {
  const backendUrl = process.env.URL_BACKEND?.replace(/\/$/, "");
  const verifyUrl = `${backendUrl}/usuarios/verificar/${encodeURIComponent(token)}`;

  const mailOptions = {
    from: `"Ring Town 🎵" <${process.env.USER_MAILTRAP}>`,
    to: userMail,
    subject: "🎶 Ring Town - Verifica tu cuenta",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f4f4f4; border: 1px solid #ddd;">
        <h2 style="color: #8A0000;">¡Bienvenido a Ring Town!</h2>
        <p>Gracias por registrarte. Verifica tu cuenta dando clic en el botón:</p>
        <div style="text-align: center; margin: 30px;">
          <a href="${verifyUrl}" style="background-color: #C83F12; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
            Verificar mi cuenta
          </a>
        </div>
        <p>Si no hiciste este registro, puedes ignorar este correo.</p>
        <footer style="text-align: center; font-size: 13px; color: #777;">
          Ring Town 🎵 &copy; ${new Date().getFullYear()}
        </footer>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error al enviar el correo:", error);
    } else {
      console.log("✅ Correo de verificación enviado:", info.messageId);
    }
  });
};

// 📧 Correo de recuperación de contraseña
export const sendMailToRecoveryPassword = async (email, token) => {
  const frontendUrl = process.env.URL_FRONTEND?.replace(/\/$/, "");
  const resetUrl = `${frontendUrl}/recuperar-password?token=${encodeURIComponent(token)}&valid=true`;

  const info = await transporter.sendMail({
    from: `"Ring Town 🎵" <${process.env.USER_MAILTRAP}>`,
    to: email,
    subject: "🔐 Recuperación de contraseña - Ring Town",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f4f4f4; border: 1px solid #ddd;">
        <h2 style="color: #8A0000;">¿Olvidaste tu contraseña?</h2>
        <p>Haz clic en el botón para restablecerla:</p>
        <div style="text-align: center; margin: 30px;">
          <a href="${resetUrl}" style="background-color: #3B060A; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
            Restablecer contraseña
          </a>
        </div>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <footer style="text-align: center; font-size: 13px; color: #777;">
          Ring Town 🎵 &copy; ${new Date().getFullYear()}
        </footer>
      </div>
    `
  });

  console.log("✅ Correo de recuperación enviado:", info.messageId);
};
