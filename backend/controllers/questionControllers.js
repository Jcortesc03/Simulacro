import { saveQuestion, getLastQuestions } from '../database/questions.js';

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

export { saveQuestionHandler, getLastQuestionsHandler };
