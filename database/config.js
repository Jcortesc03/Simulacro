import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.host);

const connection = mysql.createConnection({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || '',
    database: process.env.DATABASE || 'simulacro',
});

connection.connect(err => {
    if(err){
        console.error(`Hubo un error ${err}`);
        return;
    }
    console.log('Conexión exitosa');
    
});