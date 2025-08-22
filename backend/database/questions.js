import db from './config.js';
import id from '../utils/uuid.js';

const getLastQuestionsForAI = async () => {
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

const saveQuestion = async (subCategoryId, statement, questionType, imagePath, creationDate,
    aiGenerated, difficulty, justification, status, answers) => {
    //La estructura es question_id, sub_category_id, statement, question_type, image_path,
    //creation_date, ai_generated, difficulty,  justification, status.
    //La tabla de preguntas se llama questions
    
    const questionId = id();

    db.query(`
    INSERT INTO questions(question_id, sub_category_id, statement, question_type, image_path, creation_date,
    ai_generated, difficulty, justification, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [questionId, subCategoryId, statement, questionType, imagePath, creationDate, aiGenerated, difficulty, 
    justification, status]);
    
    //la tabla se llama answer_options
    //La estructura es: option_id(uuid), question_id(uuid), option_text, is_correct(boolean)

    for (const answer of answers){
        const { option_text, isCorrect } = answer;

        await db.query(` 
        INSERT INTO answer_options(option_id, question_id, option_text, is_correct) VALUES (?, ?, ?, ?)`,
        [id(), questionId, option_text, isCorrect]);
    };
    return {success: true, questionId};
    
}

const getLastQuestions = async (categoryName, questionNumber) => {
    const limit = Number(questionNumber);
    if (isNaN(limit) || limit <= 0) {
        throw new Error('Número de preguntas inválido');
    };
    const [questions] = await db.query(`
            SELECT q.question_id, q.statement, q.difficulty, sc.sub_category_name
            FROM QUESTIONS q
            JOIN SUB_CATEGORIES sc ON q.sub_category_id = sc.sub_category_id
            JOIN CATEGORIES c ON sc.category_id = c.category_id
            WHERE c.category_name = ?
            ORDER BY RAND()
            LIMIT ?;`,[ categoryName, questionNumber]);

    const enrichedQuestions = [];

    for (const question of questions) {
    const [answers] = await db.query(`
      SELECT option_id, option_text, is_correct 
      FROM answer_options 
      WHERE question_id = ?
    `, [question.question_id]);

    enrichedQuestions.push({
      ...question,
      answers
    });
  }
    return enrichedQuestions;
    
};
export { getLastQuestionsForAI, saveQuestion, getLastQuestions };