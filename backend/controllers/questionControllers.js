import { saveQuestion, getLastQuestions, deleteQuestion, updateQuestion } from '../database/questions.js';

const saveQuestionHandler = async (req, res) => {
    const {
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
    } = req.body

    const requiredFields = [
    subCategoryId,
    statement,
    questionType,
    creationDate,
    aiGenerated,
    difficulty,
    justification,
    status,
    answers
    ];

    if (requiredFields.some(field => field === undefined || field === null || field === ''))
    return res.status(400).send('Falta un dato');

    try{
        const result = await saveQuestion(subCategoryId, statement, questionType, imagePath,
        creationDate, aiGenerated, difficulty, justification, status, answers);
        res.status(201).send('Pregunta creada correctamente');

    }catch(err){
        console.log(err);
        res.status(500).send('Hubo un error')
    }


}

const getLastQuestionsHandler = async (req, res) => {
    const { categoryName, questionNumber } = req.query; 

    const numQuestions = parseInt(questionNumber, 10);

    if (!categoryName || isNaN(numQuestions) || numQuestions <= 0)
        return res.status(400).send('Faltan parámetros: categoryName y questionNumber (número válido)');

    try {
        const result = await getLastQuestions(categoryName, numQuestions);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Hubo un error');
    }
};

const deleteQuestionHandler = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('El ID de la pregunta es requerido');
    }

    try {
        const success = await deleteQuestion(id);
        if (success) {
            res.status(200).send('Pregunta eliminada correctamente');
        } else {
            res.status(404).send('La pregunta no fue encontrada');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Hubo un error al eliminar la pregunta');
    }
};

const updateQuestionHandler = async (req, res) => {
    const { id } = req.params;
    const questionData = req.body;

    const requiredFields = [
        'statement',
        'questionType',
        'difficulty',
        'justification',
        'status',
        'answers'
    ];

    for (const field of requiredFields) {
        if (questionData[field] === undefined || questionData[field] === null || questionData[field] === '') {
            return res.status(400).send(`Falta el campo requerido: ${field}`)
        }
    }

    try {
        const result = await updateQuestion(id, questionData);
        if (result.success) {
            res.status(200).send('Pregunta actualizada correctamente');
        } else {
            res.status(404).send('La pregunta no fue encontrada');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Hubo un error al actualizar la pregunta');
    }
};

export { saveQuestionHandler, getLastQuestionsHandler, deleteQuestionHandler, updateQuestionHandler };
