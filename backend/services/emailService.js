import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.BASE_URL}/auth/verify/${token}`;
  await transporter.sendMail({
    from: `"Mi App :)" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verificación de cuenta",
    html: `<h3>Verifica tu cuenta</h3><a href="${url}">Clic aquí para verificar</a>`
  });
};



export default sendVerificationEmail;
