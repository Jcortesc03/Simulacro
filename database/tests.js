import db from './config.js';

const saveSimulationAttempt = async (attemptId, userId, simulationId, startTime, endTime, totalScore, status) => {
    
    const [rows] = await db.prepare(`
        INSERT INTO simulation_attempts (attempt_id, user_id, simulation_id, start_time, end_time, total_score, status)
        VALUES (?, ?, ?, ?, ?, ?, ?);`, [attemptId, userId, simulationId, startTime, endTime, totalScore, status]);
    console.log(rows);    
    return rows;
};

const saveSimulation = async (simulationId, simulationName, description, creationDate, isActive) => {
    const [rows] = await db.prepare(`
        INSERT INTO simulations (simulation_id, simulation_name, description, creation_date, is_active) VALUES
        (?, ?, ?, ?, ?)`, [simulationId, simulationName, description, creationDate, isActive]);
    console.log(rows);
    return rows;
    };
    
const saveSimulationQuestions = async (simulationQuestionId, simulationQuestions, questionId, displayOrder) => {
    const [ rows ] = await db.prepare(`
        INSERT INTO simulation_questions (simulation_question_id, simulation_questions, question_id, display order) VALUES
        (? ,? ,? ,? )`, [simulationQuestionId, simulationQuestions, questionId, displayOrder]);
    console.log(rows);
    return rows;
};

export { saveSimulationAttempt, saveSimulation, saveSimulationQuestions };