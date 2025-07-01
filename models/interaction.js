import db from '../database/config.js';



const saveUser = async (name, password) => {
    const [ result ] = await db.query(
        `INSERT INTO users (name, password, role) values (?, ?, ?)`, [name, password, 'user']
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