import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import token from '../utils/generateToken.js';

dotenv.config({ path: './.env' });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (email, token) => {
    const link = `${process.env.NGROOK_DOMAIN}/auth/verify/${token}`;

    await transporter.sendMail({
        from: `Confirmación <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: `Por favor autentique su correo electrónico`,
        html: `<h3>Gracias por registrarte</h3> <p>Por favor verifique su correo electrónico para continuar.</p> <a href="${link}">Verificar cuenta</a>`
    });
};

export default sendVerificationEmail;