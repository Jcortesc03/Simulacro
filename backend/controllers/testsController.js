import { saveSimulation, saveSimulationAttempt, saveSimulationQuestions } from '../database/tests.js';
import { getAnswerById, getQuestionById, getSimulationByName, getTestsByUser } from '../database/tests.js';
import { retroalimentateTest }  from '../services/geminiService.js';
import id from '../utils/uuid.js';

const saveSimulationHandler = async (req, res) => {
    try{
        const { simulationName, description, creationDate, isActive } = req.body;
        const result = await saveSimulation(id(), simulationName, description, creationDate, isActive);
        return res.status(200).send('Prueba guardada satisfactoriamente');

    } catch(err){
        console.log(err);
        return res.status(500).send('Hubo un error');
    };
    
};

const saveSimulationAttemptHandler = async (req, res) => {
    try{

        const { user_answers, user_id, simulation_id, start_time, end_time, total_score, status } = req.body;

        const formatDate = (isoString) => {
            const date = new Date(isoString);
            return date.toISOString().slice(0, 19).replace("T", " "); 
        };
        
        const response = await saveSimulationAttempt(id(), user_id, await getSimulationByName(simulation_id), formatDate(start_time), formatDate(end_time), total_score, status);
        console.log(response);
        
        const answers = [];

        for (const i of user_answers) {
            const answerStatement =  await getAnswerById(i.selected_option_id);
            const questionStatement = await getQuestionById(i.question_id);
            const isCorrect = i.is_correct;
            const questionScore = i.question_score;

            const answer = { questionStatement, answerStatement, isCorrect, questionScore};
            answers.push(answer);
        };

        const retroalimentation = await retroalimentateTest(JSON.stringify(answers, null, 2));


        return res.status(200).send({ message: 'Prueba realizada con exito', response, retroalimentation });


    } catch(err){
        console.log(err);
        return res.status(500).send('Hubo un error');
    };
};
    
const saveSimulationQuestionsHandler = async (req, res) => {
    const { simulationQuestionId, simulationQuestions, questionId, displayOrder } = req.body;
        
    try{
        const response = await saveSimulationAttempt(simulationQuestionId, simulationQuestions, questionId, displayOrder);
        console.log(response);
        return res.status(200).send('Preguntas de simulacro guardadas con éxito');
    
    } catch(err){
        console.log(err);
        return res.status(500).return('Hubo un error');
    };
};

const getTestsByUserHandler = async (req, res) => {
    try{
    const { userEmail } = req.body;
    const tests = await getTestsByUser(userEmail);
    console.log(tests);
    return res.status(200).send({message: 'Tests recuperados con exito', tests})
    }catch(err){
        console.log(err);
        return res.status(400).send('Hubo un error');
    }

}


export { saveSimulationAttemptHandler, saveSimulationHandler, saveSimulationQuestionsHandler, getTestsByUserHandler };