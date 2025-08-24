import {
  saveSimulation,
  saveSimulationAttempt,
  saveSimulationQuestions,
  getSimulationAttempts,
  getAnswerById,
  getQuestionById,
  getTestsByUser,
} from "../database/tests.js";

import { retroalimentateTest } from "../services/geminiService.js";
import id from "../utils/uuid.js";
import jwt from "jsonwebtoken";

const saveSimulationHandler = async (req, res) => {
  try {
    const { simulationName, description, creationDate, isActive } = req.body;
    await saveSimulation(
      id(),
      simulationName,
      description,
      creationDate,
      isActive
    );
    return res.status(200).send("Prueba guardada satisfactoriamente");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Hubo un error");
  }
};

const saveSimulationAttemptHandler = async (req, res) => {
  try {
    const {
      user_answers,
      simulation_id,
      start_time,
      end_time,
      total_score,
      status,
    } = req.body;

    const user_id = req.user?.id || req.user?.user_id;
    if (!user_id) {
      return res.status(400).json({ message: "No se pudo obtener el usuario del token" });
    }

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

      // 🔹 MEJORA: Manejar casos donde answerStatement es null
      const answerText = answerStatement?.option_text || "No respondida";
      const questionText = questionStatement?.statement || "Pregunta no encontrada";

      answers.push({
        questionStatement: questionText, // Solo el texto, no el objeto completo
        answerStatement: answerText, // Solo el texto, no el objeto completo
        isCorrect: i.is_correct,
        questionScore: i.question_score,
      });
    }

    console.log("📋 Answers para IA (procesadas):", JSON.stringify(answers, null, 2));

    // 🔹 VALIDACIÓN: Solo generar IA si hay respuestas válidas
    let retroalimentation = "No se pudo generar retroalimentación debido a respuestas incompletas.";

    const validAnswers = answers.filter(a => a.questionStatement && a.answerStatement !== "No respondida");

    if (validAnswers.length > 0) {
      console.log(`✅ ${validAnswers.length} respuestas válidas para IA`);
      retroalimentation = await retroalimentateTest(JSON.stringify(validAnswers, null, 2));
    } else {
      console.log("⚠️ No hay respuestas válidas para generar retroalimentación");
    }

    console.log("🤖 Retroalimentación final:", retroalimentation);

    return res.status(200).json({
      message: "Prueba realizada con éxito",
      response,
      retroalimentation,
    });
  } catch (err) {
    console.error("❌ Error en saveSimulationAttemptHandler:", err);
    return res.status(500).json({
      message: "Hubo un error",
      error: err.message,
      retroalimentation: "Error al generar retroalimentación. Por favor, contacta al administrador."
    });
  }
};

const saveSimulationQuestionsHandler = async (req, res) => {
  const {
    simulationQuestionId,
    simulationQuestions,
    questionId,
    displayOrder,
  } = req.body;
  try {
    await saveSimulationQuestions(
      simulationQuestionId,
      simulationQuestions,
      questionId,
      displayOrder
    );
    return res.status(200).send("Preguntas de simulacro guardadas con éxito");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Hubo un error");
  }
};

const getTestsByUserHandler = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const tests = await getTestsByUser(userEmail);
    return res
      .status(200)
      .send({ message: "Tests recuperados con éxito", tests });
  } catch (err) {
    console.error(err);
    return res.status(400).send("Hubo un error");
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
    return res
      .status(500)
      .send("Hubo un error al recuperar intentos de simulacro");
  }
};

export {
  saveSimulationAttemptHandler,
  saveSimulationHandler,
  saveSimulationQuestionsHandler,
  getTestsByUserHandler,
  getSimulationAttemptsHandler,
};
