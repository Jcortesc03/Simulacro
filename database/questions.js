import db from './config.js';

const getLastQuestions = async () => {
    const [rows] = await db.query(`SELECT 
    Q.question_id,
    Q.statement,
    Q.question_type,
    Q.difficulty,
    Q.ai_generated,
    A.option_id,
    A.option_text,
    A.is_correct
FROM QUESTIONS Q
JOIN ANSWER_OPTIONS A ON Q.question_id = A.question_id
WHERE Q.ai_generated = 0
ORDER BY Q.creation_date DESC
LIMIT 20;`)

const questionsMap = new Map();

 rows.forEach(row => {
        if (!questionsMap.has(row.question_id)) {
            questionsMap.set(row.question_id, {
                question_id: row.question_id,
                statement: row.statement,
                question_type: row.question_type,
                difficulty: row.difficulty,
                ai_generated: row.ai_generated,
                answer_options: []
            });
        }

        questionsMap.get(row.question_id).answer_options.push({
            option_id: row.option_id,
            option_text: row.option_text,
            is_correct: row.is_correct
        });
    });

    // Solo queremos las últimas 5 preguntas
    const questions = Array.from(questionsMap.values()).slice(0, 5);

    return questions;
};

const saveQuestion = async (questionId, subCategoryId, statement, questionType, imagePath, creationDate,
    aiGenerated, difficulty, justification, status) => {
    //La estructura es question_id, sub_category_id, statement, question_type, image_path,
    //creation_date, ai_generated, difficulty,  justification, status.
    //La tabla de preguntas se llama questions
    
    db.query(`
    INSERT INTO questions(question_id, sub_category_id, statement, question_type, image_path, creation_date,
    ai_generated, difficulty, justification, status)`), 
    [questionId, subCategoryId, statement, questionType, imagePath, creationDate, aiGenerated, difficulty, 
    justification, status];

    
}

export { getLastQuestions, saveQuestion };