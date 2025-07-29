import db from './config.js';

const saveTest = async (attemptId, userId, simulationId, startTime, endTime, totalScore, status) => {
    
    const [rows] = await db.prepare(`
        INSERT INTO simulation_attempts (attempt_id, user_id, simulation_id, start_time, end_time, total_score, status)
        VALUES (?, ?, ?, ?, ?, ?, ?);`, [attemptId, userId, simulationId, startTime, endTime, totalScore, status]);
    console.log(rows);
    
    return rows;
}

export { saveTest };