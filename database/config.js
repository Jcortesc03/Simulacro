import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.localhost || 'localhost',
    user: process.env.user || 'root',
    password: process.env.password || '',
    database: process.env.database || 'simulacro',
});

connection.connect(err => {
    if(err){
        console.error(`Hubo un error ${err}`);
        return;
    }
    console.log('Conexión exitosa');
    
})