import Database from 'better-sqlite3';

const db = new Database('../database/database.db');

db.prepare(`
    CREATE TABLE IF NOT EXISTS users(
    name VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    rol TEXT CHECK(rol IN('user', 'admin', 'teacher'))
    )
    `).run();


