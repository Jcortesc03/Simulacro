import db from './config.js';

const saveUser = async (id, name, password, programName, email) => {
  const [[{ program_id }]] = await db.query(
    `SELECT program_id
     FROM programs
     WHERE program_name = ?;`,
    [programName]
  );

  await db.query(
    `INSERT INTO users (user_id, user_name, password_hash, role_id, program_id, email)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, password, '1', program_id, email]
  );
};

const getUser = async (email) => {
  const [rows] = await db.query(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  if (rows.length === 0) return null;
  return rows[0];
};

const verifyUser = async (email) => {
  await db.query(
    `UPDATE users SET verificated = TRUE WHERE email = ?`,
    [email]
  );
};

const changePassword = async (id, password) => {
  await db.query(
    `UPDATE users SET password_hash = ? WHERE user_id = ?`,
    [password, id]
  );
};

const getSubjects = async () => {
  const [rows] = await db.query(
    `SELECT * FROM programs`
  );
  return rows;
};

export default { saveUser, getUser, verifyUser, changePassword, getSubjects };
