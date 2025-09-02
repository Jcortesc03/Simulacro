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
    
    // Lógica de detección robusta y explícita
    const isGeneralTest = Array.isArray(user_answers) && user_answers.length > 1 && user_answers.some(a => typeof a.answer_text === 'string');
    const isWrittenTest = Array.isArray(user_answers) && user_answers.length === 1 && typeof user_answers[0]?.answer_text === 'string';

    if (isGeneralTest) {
      // --- CAMINO 1: LÓGICA PARA LA PRUEBA GENERAL (LA MÁS ESPECÍFICA PRIMERO) ---
      console.log("📝 Entrando en la lógica para Prueba General Mixta.");
      
      const essayAnswer = user_answers.find(a => typeof a.answer_text === 'string');
      const mcAnswers = user_answers.filter(a => typeof a.answer_text !== 'string');

      const evaluation = await evaluateWrittenCommunication(essayAnswer.answer_text);
      const essayScore = parseInt(evaluation.score, 10);
      const essayFeedback = evaluation.feedback;
      if (isNaN(essayScore)) throw new Error("La IA de ensayo no devolvió un puntaje válido.");
      
      const { total_score_mc } = req.body; 
      
      // Combinamos los puntajes: 80% opción múltiple, 20% ensayo (puedes ajustar estos pesos)
      const finalScore = (total_score_mc * 0.8) + (essayScore * 0.2);

      const mcFeedback = await retroalimentateTest(JSON.stringify(mcAnswers, null, 2));
      const unifiedFeedback = `--- Retroalimentación de Escritura ---\n${essayFeedback}\n\n--- Retroalimentación General ---\n${mcFeedback}`;

      const attempt_id = id();
      await saveSimulationAttempt(
        attempt_id, user_id, simulation_id, formatDate(start_time),
        formatDate(end_time), Math.round(finalScore), status
      );
      
      return res.status(200).json({
        message: "Prueba General evaluada con éxito",
        retroalimentation: unifiedFeedback,
        score: Math.round(finalScore)
      });

    } else if (isWrittenTest) {
      // --- CAMINO 2: LÓGICA PARA PRUEBA DE ESCRITURA INDIVIDUAL ---
      console.log("📝 Entrando en la lógica correcta para Prueba de Escritura Individual.");
      const essayText = user_answers[0].answer_text;
      const evaluation = await evaluateWrittenCommunication(essayText);
      const finalScore = parseInt(evaluation.score, 10);
      const retroalimentation = evaluation.feedback;

      if (isNaN(finalScore)) {
        throw new Error("La IA no devolvió un puntaje numérico válido.");
      }

      const attempt_id = id();
      await saveSimulationAttempt(
        attempt_id, user_id, simulation_id, formatDate(start_time),
        formatDate(end_time), finalScore, status
      );
      
      return res.status(200).json({
        message: "Prueba de escritura evaluada con éxito",
        retroalimentation: retroalimentation,
        score: finalScore
      });

    } else {
      // --- CAMINO 3: LÓGICA PARA PRUEBAS DE OPCIÓN MÚLTIPLE ---
      console.log("✅ Entrando en la lógica para Prueba de Opción Múltiple.");
      const { total_score } = req.body;
      await saveSimulationAttempt(
        id(), user_id, simulation_id, formatDate(start_time),
        formatDate(end_time), total_score, status
      );

      const answers = [];
      for (const i of user_answers) {
        const answerStatement = await getAnswerById(i.selected_option_id);
        const questionStatement = await getQuestionById(i.question_id);
        answers.push({
          questionStatement: questionStatement?.statement || "Pregunta no encontrada",
          answerStatement: answerStatement?.option_text || "No respondida",
          isCorrect: i.is_correct,
          questionScore: i.question_score,
        });
      }

      let retroalimentation = "No se pudo generar retroalimentación.";
      const validAnswers = answers.filter(a => a.answerStatement !== "No respondida");
      
      if (validAnswers.length > 0) {
        retroalimentation = await retroalimentateTest(JSON.stringify(validAnswers, null, 2));
      }

      return res.status(200).json({
        message: "Prueba realizada con éxito",
        retroalimentation,
        score: total_score 
      });
    }

  } catch (err) {
    console.error("❌ Error en saveSimulationAttemptHandler:", err);
    return res.status(500).json({
      message: "Hubo un error en el servidor al procesar la prueba.",
      error: err.message,
      retroalimentation: "Error al generar retroalimentación. Por favor, contacta al administrador.",
      score: 0
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
  } catch (err)
 {
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