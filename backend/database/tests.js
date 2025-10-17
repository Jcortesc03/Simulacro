import db from "./config.js";
import id from '../utils/uuid.js';

export const saveSimulationAttempt = async (
  attemptId,
  userId,
  simulationId,
  startTime,
  endTime,
  totalScore,
  status,
  feedback // El nuevo parámetro para el feedback
) => {
  const params = [
    attemptId,
    userId,
    simulationId,
    startTime,
    endTime,
    totalScore,
    status,
    feedback, // Se incluye en los parámetros
  ].map((v) => (v === undefined ? null : v));

  const { rows } = await db.query(
    `INSERT INTO simulation_attempts
      (attempt_id, user_id, simulation_id, start_time, end_time, total_score, status, feedback)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, // Se añade la columna y el valor
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
  const { rows } = await db.query(
    `INSERT INTO simulations (simulation_id, simulation_name, description, creation_date, is_active)
     VALUES ($1, $2, $3, $4, $5)`,
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
  const { rows } = await db.query(
    `INSERT INTO simulation_questions
      (simulation_question_id, simulation_id, question_id, display_order)
     VALUES ($1, $2, $3, $4)`,
    [simulationQuestionId, simulationQuestions, questionId, displayOrder]
  );
  return rows;
};

const getSimulationByName = async (simulationName) => {
  const { rows } = await db.query(
    `SELECT simulation_id FROM simulations WHERE simulation_name = $1`,
    [simulationName]
  );
  return rows[0]?.simulation_id || null;
};

const getQuestionById = async (questionId) => {
  const { rows } = await db.query(
    `SELECT statement FROM questions WHERE question_id = $1`,
    [questionId]
  );
  return rows[0] || null;
};

const getAnswerById = async (answerId) => {
  const { rows } = await db.query(
    `SELECT option_text FROM answer_options WHERE option_id = $1`,
    [answerId]
  );
  return rows[0] || null;
};

const getTestsByUser = async (userEmail) => {
  const { rows: userRows } = await db.query(
    `SELECT user_id FROM users WHERE email = $1`,
    [userEmail]
  );

  if (userRows.length === 0) return null;

  const userId = userRows[0].user_id;

  const { rows } = await db.query(
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
     WHERE u.user_id = $1
     ORDER BY sa.start_time DESC, sq.display_order ASC;`,
    [userId]
  );

  return rows;
};

const getSimulationAttempts = async () => {
  const { rows } = await db.query(
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
  const { rows } = await db.query(
    `SELECT
        sa.attempt_id,
        s.simulation_name,
        sa.total_score,
        sa.start_time,
        sa.end_time
     FROM simulation_attempts sa
     JOIN simulations s ON sa.simulation_id = s.simulation_id
     WHERE sa.user_id = $1
     ORDER BY sa.start_time DESC;`,
    [userId]
  );

  return rows;
};
const getAttemptById = async (attemptId) => {
  const { rows } = await db.query(
    `SELECT
        sa.attempt_id,
        sa.total_score,
        sa.start_time,
        sa.end_time,
        sa.feedback,
        s.simulation_name
     FROM simulation_attempts sa
     JOIN simulations s ON sa.simulation_id = s.simulation_id
     WHERE sa.attempt_id = $1;`,
    [attemptId]
  );
  return rows[0];
};

const getUserAnswersByAttemptId = async (attemptId) => {
  const { rows } = await db.query(
    `SELECT
        ua.question_id,
        q.statement,
        q.image_path,
        ua.answer_text,
        ua.selected_option_id,
        (SELECT JSON_AGG(JSON_BUILD_OBJECT('option_id', option_id, 'option_text', option_text, 'is_correct', is_correct)) FROM answer_options WHERE answer_options.question_id = q.question_id) as options
     FROM user_answers ua
     JOIN questions q ON ua.question_id = q.question_id
     WHERE ua.attempt_id = $1;`,
    [attemptId]
  );
  return rows.map(row => ({
      ...row,
      // PostgreSQL ya devuelve esto como JSON
      options: row.options || []
  }));
};
const saveUserAnswer = async (attemptId, answer) => {
  const userAnswerId = id();
  await db.query(
     `INSERT INTO user_answers (user_answer_id, attempt_id, question_id, selected_option_id, answer_text, is_correct, question_score)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      userAnswerId,
      attemptId,
      answer.question_id,
      answer.selected_option_id || null,
      answer.answer_text || null,
      answer.is_correct,
      answer.question_score
    ]
  );
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
  getUserAnswersByAttemptId,
  getAttemptById,
  saveUserAnswer
};