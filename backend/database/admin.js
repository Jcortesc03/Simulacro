import db from "./config.js";
import userDb from "./usersAuth.js";

const getPagedUsers = async (limit, offset) => {
  const { rows: usuarios } = await db.query(
    `SELECT
      u.user_name AS name,
      u.email AS email,
      u.verificated AS verified,
      pro.program_name AS program,
      ro.role_name AS role
    FROM users u
    JOIN roles ro ON u.role_id = ro.role_id
    JOIN programs pro ON u.program_id = pro.program_id
    ORDER BY u.user_name DESC
    LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return usuarios;
};

const adminSaveUser = async (id, name, password, programName, email) => {
  await userDb.saveUser(id, name, password, programName, email);
  await userDb.verifyUser(email);
};

const changeRole = async (email, roleName) => {
  const roleMapping = {
    estudiante: 1,
    profesor: 2,
    admin: 3,
  };
  const roleId = roleMapping[roleName.toLowerCase()];
  if (!roleId) {
    throw new Error(`Rol no reconocido: ${roleName}`);
  }
  await db.query(`UPDATE users SET role_id = $1 WHERE email = $2`, [roleId, email]);
};

const deleteUser = async (email) => {
  await db.query(`DELETE FROM users WHERE email = $1`, [email]);
};

const getCategories = async () => {
  const { rows: categories } = await db.query("SELECT * FROM categories");
  return categories;
};

const getSubCategories = async () => {
  const { rows: subCategories } = await db.query(`
    SELECT
      sc.sub_category_id,
      sc.sub_category_name,
      sc.description,
      c.category_name,
      c.category_id
    FROM sub_categories sc
    JOIN categories c ON sc.category_id = c.category_id
    ORDER BY c.category_name, sc.sub_category_name
  `);
  return subCategories;
};

const getTotalUsers = async () => {
  const { rows } = await db.query(`SELECT COUNT(*) AS total FROM users`);
  return rows[0].total;
};

const getTotalSimulations = async () => {
  const { rows } = await db.query(`SELECT COUNT(*) AS total FROM simulation_attempts`);
  return rows[0].total;
};

const getAverageScoresBySubject = async () => {
  const { rows } = await db.query(`
    SELECT
      s.simulation_name AS subject,
      ROUND(AVG(sa.total_score)) AS averageScore
    FROM simulation_attempts sa
    JOIN simulations s ON sa.simulation_id = s.simulation_id
    GROUP BY s.simulation_name
    ORDER BY averageScore DESC
  `);
  return rows;
};

// --- FUNCIÓN AÑADIDA ---
const getUserByEmail = async (email) => {
  const { rows } = await db.query(
    `SELECT user_id, user_name, email FROM users WHERE email = $1`,
    [email]
  );
  if (rows.length === 0) return null;
  return rows[0];
};

export default {
  getPagedUsers,
  adminSaveUser,
  changeRole,
  deleteUser,
  getCategories,
  getSubCategories,
  getTotalUsers,
  getTotalSimulations,
  getAverageScoresBySubject,
  getUserByEmail, // <-- Exportación añadida
};