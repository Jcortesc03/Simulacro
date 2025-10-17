// backend/database/config.js (VERSIÓN POSTGRESQL)

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// Configuración de conexión a PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Verificar la conexión
pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error en la conexión a PostgreSQL:', err);
});

export default pool;