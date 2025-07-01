import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'}); //for the relative route

console.log(process.env.HOST);

const connection = await mysql.createConnection({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || '',
    database: process.env.DATABASE || 'simulacro',
});


export default connection;
