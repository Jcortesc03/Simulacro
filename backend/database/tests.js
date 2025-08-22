import db from './config.js';

const saveSimulationAttempt = async (attemptId, userId, simulationId, startTime, endTime, totalScore, status) => {
    
    const [rows] = await db.execute(`
        INSERT INTO simulation_attempts (attempt_id, user_id, simulation_id, start_time, end_time, total_score, status)
        VALUES (?, ?, ?, ?, ?, ?, ?);`, [attemptId, userId, simulationId, startTime, endTime, totalScore, status]);
    console.log(rows);    
    return rows;
};

const saveSimulation = async (simulationId, simulationName, description, creationDate, isActive) => {
    const [rows] = await db.execute(`
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

const getSimulationByName = async(simulationName) => {
    const [rows] = await db.query(`
        SELECT simulation_id
        FROM simulations
        WHERE simulation_name = ?    
    `,[simulationName]
    );
    console.log(rows[0].simulation_id);
    return rows[0].simulation_id;
};

const getQuestionById = async (questionId) => {
    const [ rows ]  = await db.query(`
        SELECT statement 
        FROM questions
        WHERE question_id = ?`, [questionId]
    );
    return rows[0];
};

const getAnswerById = async (answerId) => {
    const [ rows] = await db.query(`
        SELECT option_text
        FROM answer_options
        WHERE option_id = ?`, [answerId]
    );
    return rows[0];
};

const getTestsByUser = async (userEmail) => {
    const [ userId ] = await db.execute(`
    SELECT user_id
    FROM users
    WHERE email = ?`, [ userEmail ]
    );

    const [ rows ] = await db.query(
        ` 
        SELECT 
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
            FROM USERS u
            JOIN SIMULATION_ATTEMPTS sa 
                ON u.user_id = sa.user_id
            JOIN SIMULATIONS s 
                ON sa.simulation_id = s.simulation_id
            JOIN USER_ANSWERS uq 
                ON sa.attempt_id = uq.attempt_id
            JOIN QUESTIONS q 
                ON uq.question_id = q.question_id
            JOIN SIMULATION_QUESTIONS sq 
                ON s.simulation_id = sq.simulation_id 
                AND q.question_id = sq.question_id
            LEFT JOIN ANSWER_OPTIONS ao 
                ON uq.selected_option_id = ao.option_id
            WHERE u.user_id = ?
            ORDER BY sa.start_time DESC, sq.display_order ASC;
      `, [ userId]
    );

};

export { saveSimulationAttempt, saveSimulation, saveSimulationQuestions, getQuestionById, getAnswerById, getSimulationByName, getTestsByUser };