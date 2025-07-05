import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({path: './.env'}); //for the relative route

const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'simulacro',
});


export default connection;
