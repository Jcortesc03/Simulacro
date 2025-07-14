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
    imagePath,
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
        res.status(201).send('Usuario creado correctamente');

    }catch(err){
        console.log(err);
        res.status(500).send('Hubo un error')
    }
    

}

const getLastQuestionsHandler = async (req, res) => {
    const { subcategoryId, questionNumber } = req.body;
    try{
        const result = await getLastQuestions(subcategoryId, questionNumber);
        res.status(200).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send('Hubo un error');
    }

}

export { saveQuestionHandler, getLastQuestionsHandler };