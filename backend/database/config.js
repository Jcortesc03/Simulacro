// backend/database/config.js (VERSIÓN CORREGIDA Y SEGURA)

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs'; // <-- PASO 1: Importa el módulo 'fs' para leer archivos

dotenv.config({ path: './.env' });

// PASO 2: Define la configuración de la conexión base
const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'simulacro',
};

// PASO 3: Añade la configuración SSL SOLO si estamos en producción
// y si la ruta al certificado está definida en el .env
if (process.env.NODE_ENV === 'production' && process.env.DB_SSL_CA_PATH) {
  console.log('🔌 Habilitando conexión segura a la base de datos (SSL/TLS)...');
  connectionConfig.ssl = {
    // Lee el archivo del certificado de la Autoridad Certificadora (CA)
    // que te proporciona tu proveedor de base de datos en la nube (AWS, DigitalOcean, etc.)
    ca: fs.readFileSync(process.env.DB_SSL_CA_PATH),
  };
} else {
  console.log('🔌 Usando conexión no segura a la base de datos (entorno de desarrollo).');
}

// PASO 4: Crea la conexión usando la configuración final
const connection = await mysql.createConnection(connectionConfig);

export default connection;