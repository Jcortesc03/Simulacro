import { saveQuestion, } from '../database/questions.js';

const saveQuestionHandler = async (req, res) => {
    const {
        questionId,
        subCategoryId,
        statement,
        questionType,
        imagePath,
        creationDate,
        aiGenerated,
        difficulty,
        justification,
        status,
        optionId,
        optionText,
        isCorrect
    } = req.body

    const requiredFields = [
    questionId,
    subCategoryId,
    statement,
    questionType,
    imagePath,
    creationDate,
    aiGenerated,
    difficulty,
    justification,
    status,
    optionId,
    optionText,
    isCorrect
    ];

    if (requiredFields.some(field => field === undefined || field === null || field === ''))
    return res.status(400).send('Falta un dato');

    try{
        const [ result ] = await saveQuestion(questionId, subCategoryId, statement, questionType, imagePath, creationDate, aiGenerated, difficulty, justification, status, optionId, optionText, isCorrect);
        console.log(result);


    }catch(err){
        console.log(err);
        res.status(500).send('Hubo un error')
    }
    

}

export { saveQuestionHandler };