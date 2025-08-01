import db from './config.js';


const saveUser = async (id, name, password, programName, email) => {

    const [ [ {program_id } ] ]  = await db.query(`
        SELECT program_id
        FROM PROGRAMS
        WHERE program_name = ?;`, [ programName ]);

    console.log(program_id);

    const [ result ] = await db.query(
        `INSERT INTO users (user_id, user_name, password_hash, role_id, program_id, email) 
        values (?, ?, ?, ?, ?, ?)`, [id, name, password, '1', program_id, email]
    )};

const getUser = async (email) => {
    const [ rows ] = await db.query(
        `SELECT * from users where email = (?)`, [email]
    )
    if (rows.length === 0)
        return null;

    return rows[0];
};

const verifyUser = async (email) => {
    await db.query(
        `UPDATE users SET is_verified = TRUE where email = ?`, [email]
    )
};

export default { saveUser, getUser, verifyUser };