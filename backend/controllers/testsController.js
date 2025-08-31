import {
  saveSimulation,
  saveSimulationAttempt,
  saveSimulationQuestions,
  getSimulationAttempts,
  getAnswerById,
  getQuestionById,
  getTestsByUser,
  getTestsByUserId,
} from "../database/tests.js";
import { retroalimentateTest, evaluateWrittenCommunication } from "../services/geminiService.js";
import id from "../utils/uuid.js";

const saveSimulationHandler = async (req, res) => {
  try {
    const { simulationName, description, creationDate, isActive } = req.body;
    await saveSimulation(
      id(), simulationName, description, creationDate, isActive
    );
    return res.status(200).send("Prueba guardada satisfactoriamente");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Hubo un error");
  }
};

const saveSimulationAttemptHandler = async (req, res) => {
  try {
    console.log("\n--- INICIO: GUARDAR INTENTO DE SIMULACIÓN ---");
    console.log("1. Recibiendo payload del frontend:", JSON.stringify(req.body, null, 2));

    const {
      user_answers, simulation_id, start_time, end_time, status,
    } = req.body;

    const user_id = req.user?.id || req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ message: "No se pudo obtener el usuario del token" });
    }

    const formatDate = (isoString) => {
      if (!isoString) return null;
      return new Date(isoString).toISOString().slice(0, 19).replace("T", " ");
    };
    
    // Esta es la condición clave y robusta para detectar un ensayo.
    const isWrittenTest = Array.isArray(user_answers) && user_answers.length === 1 && user_answers[0] && typeof user_answers[0].answer_text === 'string';
    console.log(`2. ¿Es una prueba de escritura? -> ${isWrittenTest}`);

    if (isWrittenTest) {
      // --- CAMINO 1: LÓGICA PARA COMUNICACIÓN ESCRITA ---
      console.log("3. Entrando en la lógica correcta para Comunicación Escrita.");
      const essayText = user_answers[0].answer_text;
      
      const evaluation = await evaluateWrittenCommunication(essayText);
      const finalScore = parseInt(evaluation.score, 10);
      const retroalimentation = evaluation.feedback;

      if (isNaN(finalScore)) {
        throw new Error("La IA no devolvió un puntaje numérico válido. Respuesta recibida: " + JSON.stringify(evaluation));
      }
      
      console.log(`4. IA evaluó el ensayo con puntaje: ${finalScore}`);

      const attempt_id = id();
      await saveSimulationAttempt(
        attempt_id, user_id, simulation_id, formatDate(start_time),
        formatDate(end_time), finalScore, status
      );
      
      console.log(`5. Intento de ensayo guardado en DB con ID: ${attempt_id}`);
      console.log("--- FIN: INTENTO GUARDADO CON ÉXITO ---");
      
      return res.status(200).json({
        message: "Prueba de comunicación escrita evaluada con éxito",
        retroalimentation: retroalimentation,
        score: finalScore
      });

    } else {
      // --- CAMINO 2: LÓGICA PARA PRUEBAS DE OPCIÓN MÚLTIPLE ---
      console.log("3. Entrando en la lógica para Opción Múltiple (esto es incorrecto para un ensayo).");
      const { total_score } = req.body;
      await saveSimulationAttempt(
        id(), user_id, simulation_id, formatDate(start_time),
        formatDate(end_time), total_score, status
      );

      const answers = [];
      for (const i of user_answers) {
        const answerStatement = await getAnswerById(i.selected_option_id);
        const questionStatement = await getQuestionById(i.question_id);
        const answerText = answerStatement?.option_text || "No respondida";
        const questionText = questionStatement?.statement || "Pregunta no encontrada";
        answers.push({
          questionStatement: questionText,
          answerStatement: answerText,
          isCorrect: i.is_correct,
          questionScore: i.question_score,
        });
      }
      console.log("📋 Answers para IA (procesadas):", answers);

      let retroalimentation = "No se pudo generar retroalimentación debido a respuestas incompletas.";
      const validAnswers = answers.filter(a => a.answerStatement !== "No respondida");
      
      if (validAnswers.length > 0) {
        retroalimentation = await retroalimentateTest(JSON.stringify(validAnswers, null, 2));
      } else {
         console.log("⚠️ No hay respuestas válidas para generar retroalimentación");
      }
      console.log("🤖 Retroalimentación final:", retroalimentation);
      console.log("--- FIN: INTENTO GUARDADO CON ÉXITO (Opción Múltiple) ---");

      return res.status(200).json({
        message: "Prueba realizada con éxito",
        retroalimentation,
        score: total_score 
      });
    }

  } catch (err) {
    console.error("❌ Error en saveSimulationAttemptHandler:", err);
    console.log("--- FIN CON ERROR ---");
    return res.status(500).json({
      message: "Hubo un error en el servidor al procesar la prueba.",
      error: err.message,
      retroalimentation: "Error al generar retroalimentación. Por favor, contacta al administrador.",
      score: 0
    });
  }
};

// (El resto de las funciones del archivo se mantienen exactamente igual)
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

const getStudentTestsHandler = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado." });
    }

    const attemptsData = await getTestsByUserId(userId);

    if (!attemptsData || attemptsData.length === 0) {
      return res.status(200).json({ averageScore: 0, attempts: [] });
    }

    const totalScoreSum = attemptsData.reduce((sum, attempt) => sum + (Number(attempt.total_score) || 0), 0);
    const averageScore = attemptsData.length > 0 ? totalScoreSum / attemptsData.length : 0;

    const getLevel = (score) => {
      if (score > 220) return 'Nivel 4';
      if (score > 165) return 'Nivel 3';
      if (score > 145) return 'Nivel 2';
      return 'Nivel 1';
    };

    const formatDuration = (start, end) => {
      if (!start || !end) return 'N/A';
      const durationMs = new Date(end) - new Date(start);
      const hours = Math.floor(durationMs / 3600000);
      const minutes = Math.floor((durationMs % 3600000) / 60000);
      return `${hours}h ${minutes}m`;
    };

    const attempts = attemptsData.map(attempt => ({
      id: attempt.attempt_id,
      examName: attempt.simulation_name,
      score: attempt.total_score,
      level: getLevel(attempt.total_score),
      time: formatDuration(attempt.start_time, attempt.end_time),
      date: new Date(attempt.start_time).toLocaleDateString('es-ES'),
      results: null 
    }));

    return res.status(200).json({ 
      averageScore: Math.round(averageScore),
      attempts 
    });

  } catch (err) {
    console.error("Error en getStudentTestsHandler:", err);
    return res.status(500).json({ message: "Hubo un error al obtener el historial de pruebas." });
  }
};

export {
  saveSimulationAttemptHandler,
  saveSimulationHandler,
  saveSimulationQuestionsHandler,
  getTestsByUserHandler,
  getSimulationAttemptsHandler,
  getStudentTestsHandler,
};