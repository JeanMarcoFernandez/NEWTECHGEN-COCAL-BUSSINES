import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  const from = `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`;
  const info = await transporter.sendMail({ from, to, subject, html });
  console.log("Correo enviado:", info.messageId);
  return info;
}
