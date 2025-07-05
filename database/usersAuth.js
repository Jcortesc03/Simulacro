import db from './config.js';
import id from '../utils/uuid.js';


const saveUser = async (name, password, programId, email) => {
    const [ result ] = await db.query(
        `INSERT INTO users (user_id, user_name, password_hash, role_id, program_id, email) 
        values (?, ?, ?, ?, ?, ?)`, [id, name, password, 1, programId, email]
    )};

const getUser = async (name) => {
    const [ rows ] = await db.query(
        `SELECT * from users where name = (?)`, name
    )
    if (rows.length === 0)
        return null;

    return rows[0];
};

export default { saveUser, getUser };