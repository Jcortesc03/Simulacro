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
        from: `Prueba <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: `Prueba jeje`,
        html: `<h3>Gracias por registrarte</h3> <p>Esto solo es una prueba :D</p> <a href="${link}">Verificar cuenta</a>`
    });
};

export default sendVerificationEmail;