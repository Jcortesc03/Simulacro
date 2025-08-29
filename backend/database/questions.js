import db from './config.js';
import id from '../utils/uuid.js';

const getLastQuestionsForAI = async () => {
  const [rows] = await db.query(`
    SELECT
      q.question_id,
      q.statement,
      q.question_type,
      q.difficulty,
      q.ai_generated,
      a.option_id,
      a.option_text,
      a.is_correct
    FROM questions q
    JOIN answer_options a ON q.question_id = a.question_id
    WHERE q.ai_generated = 0
    ORDER BY q.creation_date DESC
    LIMIT 20;
  `);

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

const saveQuestion = async (
  subCategoryId,
  statement,
  questionType,
  imagePath,
  creationDate,
  aiGenerated,
  difficulty,
  justification,
  status,
  answers
) => {
  //La estructura es question_id, sub_category_id, statement, question_type, image_path,
  //creation_date, ai_generated, difficulty, justification, status.
  //La tabla de preguntas se llama questions

  const questionId = id();

  await db.query(
    `
    INSERT INTO questions(
      question_id,
      sub_category_id,
      statement,
      question_type,
      image_path,
      creation_date,
      ai_generated,
      difficulty,
      justification,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      questionId,
      subCategoryId,
      statement,
      questionType,
      imagePath,
      creationDate,
      aiGenerated,
      difficulty,
      justification,
      status
    ]
  );


  for (const answer of answers) {
    const { option_text, isCorrect } = answer;

    await db.query(
      `
        INSERT INTO answer_options(option_id, question_id, option_text, is_correct)
        VALUES (?, ?, ?, ?)
      `,
      [id(), questionId, option_text, isCorrect]
    );
  }

  return { success: true, questionId };
};

const getLastQuestions = async (categoryName, questionNumber) => {
  const limit = Number(questionNumber);
  if (isNaN(limit) || limit <= 0) {
    throw new Error('Número de preguntas inválido');
  }

  const [questions] = await db.query(
    `
      SELECT q.question_id, q.statement, q.difficulty, q.image_path, sc.sub_category_name
      FROM questions q
      JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id
      JOIN categories c ON sc.category_id = c.category_id
      WHERE c.category_name = ?
      ORDER BY RAND()
      LIMIT ?;
    `,
    [categoryName, questionNumber]
  );

  const enrichedQuestions = [];

  for (const question of questions) {
    const [answers] = await db.query(
      `
        SELECT option_id, option_text, is_correct
        FROM answer_options
        WHERE question_id = ?
      `,
      [question.question_id]
    );

    enrichedQuestions.push({
      ...question,
      answers
    });
  }

  return enrichedQuestions;
};

const getAllCategoriesQuestions = async () => {
  const enrichedQuestions = [];

  const categoriesConfig = [
    { name: "Lectura Crítica", amount: 35 },
    { name: "Razonamiento Cuantitativo", amount: 35 },
    { name: "Competencias Ciudadanas", amount: 35 },
    { name: "Inglés", amount: 35 },
  ];
  
  for (const { name, amount } of categoriesConfig) {
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Número de preguntas inválido para la categoría ${name}`);
    }

    const [questions] = await db.query(
      `
        SELECT q.question_id, q.statement, q.difficulty, q.image_path, sc.sub_category_name, c.category_name
        FROM questions q
        JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id
        JOIN categories c ON sc.category_id = c.category_id
        WHERE c.category_name = ?
        ORDER BY RAND()
        LIMIT ?;
      `,
      [name, amount]
    );

    for (const question of questions) {
      const [answers] = await db.query(
        `
          SELECT option_id, option_text, is_correct
          FROM answer_options
          WHERE question_id = ?
        `,
        [question.question_id]
      );

      enrichedQuestions.push({
        ...question,
        answers
      });
    }
  }

  return enrichedQuestions;
};

const getCategories = async () => {
  const [categories] = await db.query("SELECT * FROM categories");
  return categories;
};

const deleteQuestion = async (questionId) => {
  await db.query(
    `
      DELETE FROM answer_options
      WHERE question_id = ?
    `,
    [questionId]
  );

  const [result] = await db.query(
    `
      DELETE FROM questions
      WHERE question_id = ?
    `,
    [questionId]
  );

  return result.affectedRows > 0;
};

const updateQuestion = async (questionId, questionData) => {
  const {
    statement,
    questionType,
    imagePath,
    difficulty,
    justification,
    status,
    answers
  } = questionData;

  const [result] = await db.query(
    `
      UPDATE questions
      SET
        statement = ?,
        question_type = ?,
        image_path = ?,
        difficulty = ?,
        justification = ?,
        status = ?
      WHERE question_id = ?
    `,
    [
      statement,
      questionType,
      imagePath,
      difficulty,
      justification,
      status,
      questionId
    ]
  );

  if (result.affectedRows === 0) {
    return { success: false };
  }

  await db.query('DELETE FROM answer_options WHERE question_id = ?', [questionId]);

  for (const answer of answers) {
    const { option_text, isCorrect } = answer;
    await db.query(
      `
        INSERT INTO answer_options(option_id, question_id, option_text, is_correct)
        VALUES (?, ?, ?, ?)
      `,
      [id(), questionId, option_text, isCorrect]
    );
  }

  return { success: true };
};

export { getLastQuestionsForAI, saveQuestion, getLastQuestions, getCategories, deleteQuestion, updateQuestion, getAllCategoriesQuestions };
