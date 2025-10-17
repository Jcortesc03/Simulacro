import db from './config.js';

const saveUser = async (id, name, password, programName, email) => {
  const { rows } = await db.query(
    `SELECT program_id
     FROM programs
     WHERE program_name = $1;`,
    [programName]
  );
  const program_id = rows[0].program_id;

  await db.query(
    `INSERT INTO users (user_id, user_name, password_hash, role_id, program_id, email)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, name, password, '1', program_id, email]
  );
};

const getUser = async (email) => {
  const { rows } = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  if (rows.length === 0) return null;
  return rows[0];
};

const verifyUser = async (email) => {
  await db.query(
    `UPDATE users SET verificated = TRUE WHERE email = $1`,
    [email]
  );
};

const changePassword = async (id, password) => {
  await db.query(
    `UPDATE users SET password_hash = $1 WHERE user_id = $2`,
    [password, id]
  );
};

const getSubjects = async () => {
  const { rows } = await db.query(
    `SELECT * FROM programs`
  );
  return rows;
};

export default { saveUser, getUser, verifyUser, changePassword, getSubjects };
