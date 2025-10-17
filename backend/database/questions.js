import db from './config.js';
import id from '../utils/uuid.js';

const getLastQuestionsForAI = async () => {
  const { rows } = await db.query(`
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
    WHERE q.ai_generated = false
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

  const questions = Array.from(questionsMap.values()).slice(0, 5);
  return questions;
};

// =================================================================================
// =================== TU FUNCIÓN 'saveQuestion' ORIGINAL Y SIN CAMBIOS ============
// =================================================================================
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
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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

  if (answers && answers.length > 0) {
    for (const answer of answers) {
      const { option_text, isCorrect } = answer;
      await db.query(
        `
          INSERT INTO answer_options(option_id, question_id, option_text, is_correct)
          VALUES ($1, $2, $3, $4)
        `,
        [id(), questionId, option_text, isCorrect]
      );
    }
  }

  return { success: true, questionId };
};


// =================================================================================
// <<< LA ÚNICA MODIFICACIÓN: AÑADIMOS EL ARRAY 'answers' QUE FALTA PARA ESCRITURA >>>
// =================================================================================
  const getLastQuestions = async (categoryName, questionNumber) => {

    if (categoryName === 'Escritura') {
      const { rows: questionsFromDB } = await db.query(
        `
          SELECT q.question_id, q.statement, q.difficulty, q.image_path, sc.sub_category_name
          FROM questions q
          JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id
          JOIN categories c ON sc.category_id = c.category_id
          WHERE c.category_name = $1
          ORDER BY q.creation_date DESC
          LIMIT $2;
        `,
        [categoryName, questionNumber]
      );
      // AÑADIDO: Mapeamos los resultados para añadir la propiedad 'answers: []' que el frontend necesita.
      const questionsWithAnswers = questionsFromDB.map(q => ({
          ...q,
          answers: []
      }));
      return questionsWithAnswers;
    }

    // TU LÓGICA ORIGINAL PARA OTRAS CATEGORÍAS SE MANTIENE INTACTA
    const limit = Number(questionNumber);
    if (isNaN(limit) || limit <= 0) {
      throw new Error('Número de preguntas inválido');
    }

    const { rows: questions } = await db.query(
      `
        SELECT q.question_id, q.statement, q.difficulty, q.image_path, sc.sub_category_name
        FROM questions q
        JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id
        JOIN categories c ON sc.category_id = c.category_id
        WHERE c.category_name = $1
        ORDER BY RANDOM()
        LIMIT $2;
      `,
      [categoryName, limit]
    );

    const enrichedQuestions = [];
    for (const question of questions) {
      const { rows: answers } = await db.query(
        `
          SELECT option_id, option_text, is_correct
          FROM answer_options
          WHERE question_id = $1
        `,
        [question.question_id]
      );
      enrichedQuestions.push({ ...question, answers });
    }

    return enrichedQuestions;
  };

// =================================================================================
// =================== EL RESTO DE TU CÓDIGO SE MANTIENE 100% ORIGINAL ===============
// =================================================================================
const getAllCategoriesQuestions = async () => {
  console.log("\n--- INICIO: BÚSQUEDA DE PREGUNTAS GENERALES (VERSIÓN OPTIMIZADA) ---");
  const allQuestions = [];

  try {
    console.log("1. Buscando pregunta de Ensayo...");
    const { rows: essayQuestions } = await db.query(`SELECT q.question_id, q.statement, 'Escritura' as category_name FROM questions q JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id JOIN categories c ON sc.category_id = c.category_id WHERE c.category_name = 'Escritura' ORDER BY RANDOM() LIMIT 1;`);
    if (essayQuestions && essayQuestions.length > 0) {
      essayQuestions[0].isEssay = true;
      allQuestions.push(essayQuestions[0]);
      console.log("-> Pregunta de Ensayo encontrada:", essayQuestions[0].question_id);
    } else {
      console.warn("-> ADVERTENCIA: No se encontró pregunta de Ensayo.");
    }
    console.log("2. Buscando 10 preguntas para cada categoría de Opción Múltiple...");
    const mcCategoriesNames = ["Lectura Crítica", "Razonamiento Cuantitativo", "Competencias Ciudadanas", "Inglés"];
    const query = `(SELECT q.*, c.category_name, sc.sub_category_name FROM questions q JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id JOIN categories c ON sc.category_id = c.category_id WHERE c.category_name = $1 ORDER BY RANDOM() LIMIT 10) UNION ALL (SELECT q.*, c.category_name, sc.sub_category_name FROM questions q JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id JOIN categories c ON sc.category_id = c.category_id WHERE c.category_name = $2 ORDER BY RANDOM() LIMIT 10) UNION ALL (SELECT q.*, c.category_name, sc.sub_category_name FROM questions q JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id JOIN categories c ON sc.category_id = c.category_id WHERE c.category_name = $3 ORDER BY RANDOM() LIMIT 10) UNION ALL (SELECT q.*, c.category_name, sc.sub_category_name FROM questions q JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id JOIN categories c ON sc.category_id = c.category_id WHERE c.category_name = $4 ORDER BY RANDOM() LIMIT 10)`;
    const { rows: mcQuestions } = await db.query(query, [...mcCategoriesNames]);
    console.log(`-> Se encontraron ${mcQuestions.length} preguntas de opción múltiple en total.`);
    const questionIds = mcQuestions.map(q => q.question_id);
    if (questionIds.length > 0) {
        console.log("3. Buscando todas las opciones de respuesta necesarias...");
        const { rows: allOptions } = await db.query(`SELECT * FROM answer_options WHERE question_id = ANY($1::varchar[])`, [questionIds]);
        console.log(`-> Se encontraron ${allOptions.length} opciones en total.`);
        const mcQuestionsWithOptions = mcQuestions.map(question => ({ ...question, answers: allOptions.filter(option => option.question_id === question.question_id) }));
        allQuestions.push(...mcQuestionsWithOptions);
    }
    console.log(`4. Búsqueda finalizada. Total de preguntas a devolver: ${allQuestions.length}`);
    console.log("--- FIN: BÚSQUEDA DE PREGUNTAS GENERALES ---");
    return allQuestions;
  } catch (error) {
    console.error("!!! ERROR DURANTE LA BÚSQUEDA GENERAL:", error);
    console.log("--- FIN CON ERROR ---");
    return [];
  }
};

const getCategories = async () => {
  const { rows: categories } = await db.query("SELECT * FROM categories");
  return categories;
};

const deleteQuestion = async (questionId) => {
  await db.query(`DELETE FROM answer_options WHERE question_id = $1`, [questionId]);
  const { rowCount } = await db.query(`DELETE FROM questions WHERE question_id = $1`, [questionId]);
  return rowCount > 0;
};

const updateQuestion = async (questionId, questionData) => {
  const { statement, questionType, imagePath, difficulty, justification, status, answers } = questionData;
  const { rowCount } = await db.query(
    `
      UPDATE questions SET statement = $1, question_type = $2, image_path = $3,
      difficulty = $4, justification = $5, status = $6 WHERE question_id = $7
    `,
    [statement, questionType, imagePath, difficulty, justification, status, questionId]
  );
  if (rowCount === 0) {
    return { success: false };
  }
  await db.query('DELETE FROM answer_options WHERE question_id = $1', [questionId]);
  if (answers && answers.length > 0) {
    for (const answer of answers) {
      const { option_text, isCorrect } = answer;
      await db.query(`INSERT INTO answer_options(option_id, question_id, option_text, is_correct) VALUES ($1, $2, $3, $4)`, [id(), questionId, option_text, isCorrect]);
    }
  }
  return { success: true };
};

export { getLastQuestionsForAI, saveQuestion, getLastQuestions, getCategories, deleteQuestion, updateQuestion, getAllCategoriesQuestions };