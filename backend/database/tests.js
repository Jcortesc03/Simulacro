import db from "./config.js";

export const saveSimulationAttempt = async (
  attemptId,
  userId,
  simulationId,
  startTime,
  endTime,
  totalScore,
  status
) => {
  const params = [
    attemptId,
    userId,
    simulationId,
    startTime,
    endTime,
    totalScore,
    status,
  ].map((v) => (v === undefined ? null : v)); // evita undefined

  const [rows] = await db.execute(
    `INSERT INTO simulation_attempts
      (attempt_id, user_id, simulation_id, start_time, end_time, total_score, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    params
  );

  return rows;
};

const saveSimulation = async (
  simulationId,
  simulationName,
  description,
  creationDate,
  isActive
) => {
  const [rows] = await db.execute(
    `INSERT INTO simulations (simulation_id, simulation_name, description, creation_date, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [simulationId, simulationName, description, creationDate, isActive]
  );
  return rows;
};

const saveSimulationQuestions = async (
  simulationQuestionId,
  simulationQuestions,
  questionId,
  displayOrder
) => {
  const [rows] = await db.execute(
    `INSERT INTO simulation_questions
      (simulation_question_id, simulation_questions, question_id, display_order)
     VALUES (?, ?, ?, ?)`,
    [simulationQuestionId, simulationQuestions, questionId, displayOrder]
  );
  return rows;
};

const getSimulationByName = async (simulationName) => {
  const [rows] = await db.query(
    `SELECT simulation_id FROM simulations WHERE simulation_name = ?`,
    [simulationName]
  );
  return rows[0]?.simulation_id || null;
};

const getQuestionById = async (questionId) => {
  const [rows] = await db.query(
    `SELECT statement FROM questions WHERE question_id = ?`,
    [questionId]
  );
  return rows[0] || null;
};

const getAnswerById = async (answerId) => {
  const [rows] = await db.query(
    `SELECT option_text FROM answer_options WHERE option_id = ?`,
    [answerId]
  );
  return rows[0] || null;
};

const getTestsByUser = async (userEmail) => {
  const [userRows] = await db.execute(
    `SELECT user_id FROM users WHERE email = ?`,
    [userEmail]
  );

  if (userRows.length === 0) return null;

  const userId = userRows[0].user_id;

  const [rows] = await db.query(
    `SELECT
        u.user_id,
        u.user_name,
        sa.attempt_id,
        s.simulation_id,
        s.simulation_name,
        sa.start_time,
        sa.end_time,
        sa.total_score,
        q.question_id,
        q.statement AS question_text,
        q.difficulty,
        q.justification,
        uq.selected_option_id,
        ao.option_text AS selected_option_text,
        ao.is_correct AS selected_option_correct,
        uq.is_correct AS user_is_correct,
        uq.question_score
     FROM users u
     JOIN simulation_attempts sa ON u.user_id = sa.user_id
     JOIN simulations s ON sa.simulation_id = s.simulation_id
     JOIN user_answers uq ON sa.attempt_id = uq.attempt_id
     JOIN questions q ON uq.question_id = q.question_id
     JOIN simulation_questions sq
          ON s.simulation_id = sq.simulation_id
         AND q.question_id = sq.question_id
     LEFT JOIN answer_options ao ON uq.selected_option_id = ao.option_id
     WHERE u.user_id = ?
     ORDER BY sa.start_time DESC, sq.display_order ASC;`,
    [userId]
  );

  return rows;
};

const getSimulationAttempts = async () => {
  const [rows] = await db.query(
    `SELECT
        u.user_name AS estudiante,
        p.program_name AS carrera,
        s.simulation_name AS simulacro,
        sa.total_score AS nota,
        sa.start_time AS fecha
     FROM simulation_attempts sa
     JOIN users u ON sa.user_id = u.user_id
     JOIN programs p ON u.program_id = p.program_id
     JOIN simulations s ON sa.simulation_id = s.simulation_id
     ORDER BY sa.start_time DESC;`
  );
  return rows;
};

const getTestsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT
        sa.attempt_id,
        s.simulation_name,
        sa.total_score,
        sa.start_time,
        sa.end_time
     FROM simulation_attempts sa
     JOIN simulations s ON sa.simulation_id = s.simulation_id
     WHERE sa.user_id = ?
     ORDER BY sa.start_time DESC;`,
    [userId]
  );

  return rows;
};

export {
  getSimulationAttempts,
  saveSimulation,
  saveSimulationQuestions,
  getQuestionById,
  getAnswerById,
  getSimulationByName,
  getTestsByUser,
  getTestsByUserId,
};
