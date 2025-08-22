import db from './config.js';
import userDb from './usersAuth.js';

const getPagedUsers = async (limit, offset) => {
    const [usuarios] = await db.query(
      `SELECT 
        u.user_name,
        u.user_id,
        u.registration_date,
        pro.program_name,
        ro.role_name
    FROM users u
    JOIN roles ro
    ON u.role_id = ro.role_id
    JOIN programs pro
	ON u.program_id = pro.program_id
       ORDER BY user_name DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return usuarios;
};

const adminSaveUser = async (id, name, password, programName, email) =>  {
    await userDb.saveUser(id, name, password, programName, email);
    await userDb.verifyUser(email);
};

const changeRole = async (email, roleName) => {
    const [ rows ] = await db.query(`
        select role_id
        from roles
        where role_name = ?
    `, [roleName]);

    await db.query(
        `UPDATE users
        SET role_id = ?
        WHERE email = ?`,
        [ rows[0].role_id, email]
    );
};

const deleteUser = async (email) => {
    await db.query(
        `delete from users where email = ?`, [email]
    );
}

export default { getPagedUsers, adminSaveUser, changeRole, deleteUser };