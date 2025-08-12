import { saveSimulation, saveSimulationAttempt, saveSimulationQuestions } from '../database/tests.js';

const saveSimulationHandler = async (req, res) => {
    const { simulationId, simulationName, description, creationDate, isActive } = req.body;

    try{
        const result = await saveSimulation(simulationId, simulationName, description, creationDate, isActive);
        console.log(response);
        return res.status(200).status('Prueba guardada satisfactoriamente');

    } catch(err){
        console.log(err);
        return res.status(500).return('Hubo un error');
    };
    
};

const saveSimulationAttemptHandler = async (req, res) => {
    const { attemptId, userId, simulationId, startTime, endTime, totalScore, status } = req.body;
    
    
    try{
        const response = await saveSimulationAttempt(attemptId, userId, simulationId, startTime, endTime, totalScore, status);
        console.log(response);
        return res.status(200).send('Intento de prueba guardada con éxito');


    } catch(err){
        console.log(err);
        return res.status(500).return('Hubo un error');
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

export { saveSimulationAttemptHandler, saveSimulationHandler, saveSimulationQuestionsHandler };