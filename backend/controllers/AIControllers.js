/*En este archivo se manejan los controladores para todas las funciones del programa que tengan que ver
con la IA de gemini*/
import { getLastQuestionsForAI} from '../database/questions.js'; //Importa las ultimas preguntas de la DB para pasarsela a la IA
import { generateQuestion, evaluateQuestion, retroalimentateTest }  from '../services/geminiService.js' //Importa la generación y evaluación de preguntas mediante la IA
import { getAnswerById, getQuestionById } from '../database/tests.js';

//Este controlador es para generar preguntas mediante la IA.
const generateQuestionHandler = async (req, res) => {
    const { topic, subtopic, difficulty, questionNumbers } = req.body;

    if (!topic) return res.status(400).json({ error: "Topic is required" });
    if (!subtopic) return res.status(400).json({ error: "Subtopic is required" });
    if (!difficulty) return res.status(400).json({ error: "Difficulty is required" });
    if(!questionNumbers) questionNumbers=1;
    
    try {
        const pastQuestions = await getLastQuestionsForAI();
        const rawText = await generateQuestion(topic, subtopic, difficulty, pastQuestions , questionNumbers);

        // Regex para extraer el JSON limpio si viene envuelto en backticks c:
        const regex = /```json\n([\s\S]*?)\n```/;

        //Para confirmar que el texto sin formato sea compatible con 
        const match = rawText.match(regex);
        
        let jsonToParse = rawText;
        
        if (match && match[1]) {
            jsonToParse = match[1];
        }
        
        const questions = JSON.parse(jsonToParse);
        
        return res.status(200).json({ questions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error generating the question" });
    }
};

const evaluateQuestionHandler = async (req, res) => {
    const { subject, question, answer } = req.body;
    if (!subject)
        return res.status(400).send('Subject is required');
    
    try{
    const rawText = await evaluateQuestion( subject, question, answer);
    const regex = /```json\n([\s\S]*?)\n```/;
    const match = rawText.match(regex);
    
    let jsonToParse = rawText;

    if (match && match[1]) {
            jsonToParse = match[1];
    }    
    const response = JSON.parse(jsonToParse);
        
    return res.status(200).json({ response });
    }catch(err){
        console.log(err);
        return res.status(400).send('Hubo un error');
    }
};

const testRetroAlimentationHandler = async (req, res) => {
        try{
        const { user_answers } = req.body;
        const answers = [];

        for (const i of user_answers) {
            const answerStatement =  await getAnswerById(i.selected_option_id);
            const questionStatement = await getQuestionById(i.question_id);
            const isCorrect = i.is_correct;
            const questionScore = i.question_score;

            const answer = { questionStatement, answerStatement, isCorrect, questionScore};
            answers.push(answer);
        };

        const response = await retroalimentateTest(JSON.stringify(answers, null, 2));
        return res.status(200).send({message: 'Prueba evaluada con éxito', response});
    }catch(e){
        console.log(e);
        return res.status(500).send('Hubo un error')
    } 
};

export default { generateQuestionHandler, evaluateQuestionHandler, testRetroAlimentationHandler };