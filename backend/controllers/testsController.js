import {
  saveSimulation,
  saveSimulationAttempt,
  saveSimulationQuestions,
  getSimulationAttempts
} from '../database/tests.js';

import {
  getAnswerById,
  getQuestionById,
  getSimulationByName,
  getTestsByUser
} from '../database/tests.js';

import { retroalimentateTest } from '../services/geminiService.js';
import id from '../utils/uuid.js';

const saveSimulationHandler = async (req, res) => {
  try {
    const { simulationName, description, creationDate, isActive } = req.body;
    await saveSimulation(id(), simulationName, description, creationDate, isActive);
    return res.status(200).send('Prueba guardada satisfactoriamente');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Hubo un error');
  }
};

const saveSimulationAttemptHandler = async (req, res) => {
  try {
    const { user_answers, user_id, simulation_id, start_time, end_time, total_score, status } = req.body;

    const formatDate = (isoString) => {
      if (!isoString) return null;
      const date = new Date(isoString);
      return date.toISOString().slice(0, 19).replace("T", " ");
    };

    const response = await saveSimulationAttempt(
      id(),
      user_id,
      simulation_id,
      formatDate(start_time),
      formatDate(end_time),
      total_score,
      status
    );

    const answers = [];
    for (const i of user_answers) {
      const answerStatement = await getAnswerById(i.selected_option_id);
      const questionStatement = await getQuestionById(i.question_id);
      answers.push({
        questionStatement,
        answerStatement,
        isCorrect: i.is_correct,
        questionScore: i.question_score,
      });
    }

    const retroalimentation = await retroalimentateTest(JSON.stringify(answers, null, 2));

    return res.status(200).send({
      message: 'Prueba realizada con éxito',
      response,
      retroalimentation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Hubo un error');
  }
};

const saveSimulationQuestionsHandler = async (req, res) => {
  const { simulationQuestionId, simulationQuestions, questionId, displayOrder } = req.body;
  try {
    await saveSimulationQuestions(simulationQuestionId, simulationQuestions, questionId, displayOrder);
    return res.status(200).send('Preguntas de simulacro guardadas con éxito');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Hubo un error');
  }
};

const getTestsByUserHandler = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const tests = await getTestsByUser(userEmail);
    return res.status(200).send({ message: 'Tests recuperados con éxito', tests });
  } catch (err) {
    console.error(err);
    return res.status(400).send('Hubo un error');
  }
};

const getSimulationAttemptsHandler = async (req, res) => {
  try {
    const attempts = await getSimulationAttempts();
    return res.status(200).send({
      message: "Intentos de simulacro recuperados con éxito",
      data: attempts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Hubo un error al recuperar intentos de simulacro");
  }
};

export {
  saveSimulationAttemptHandler,
  saveSimulationHandler,
  saveSimulationQuestionsHandler,
  getTestsByUserHandler,
  getSimulationAttemptsHandler,
};
