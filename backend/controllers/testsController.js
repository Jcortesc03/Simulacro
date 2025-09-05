import {
  saveSimulation,
  saveSimulationAttempt,
  saveSimulationQuestions,
  getSimulationAttempts,
  getAnswerById,
  getQuestionById,
  getTestsByUser,
  getTestsByUserId,
  getAttemptById,
  getUserAnswersByAttemptId,
  saveUserAnswer
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
    if (!user_id) return res.status(401).json({ message: "No se pudo obtener el usuario del token" });

    const formatDate = (isoString) => isoString ? new Date(isoString) : null;

    const isGeneralTest = user_answers.length > 1 && user_answers.some(a => typeof a.answer_text === 'string');
    const isWrittenTest = user_answers.length === 1 && typeof user_answers[0]?.answer_text === 'string';

    const attempt_id = id(); // Generamos el ID aquí para usarlo en todas las inserciones

    if (isGeneralTest) {
      console.log("📝 Lógica Prueba General Mixta.");
      const { total_score_mc } = req.body;
      const essayAnswer = user_answers.find(a => typeof a.answer_text === 'string');
      const mcAnswers = user_answers.filter(a => typeof a.answer_text !== 'string');
      let finalScore = total_score_mc;
      let unifiedFeedback = "La retroalimentación de la IA no está disponible en este momento. La prueba se ha guardado correctamente.";

      try {
        const evaluation = await evaluateWrittenCommunication(essayAnswer.answer_text);
        const mcFeedback = await retroalimentateTest(JSON.stringify(mcAnswers, null, 2));
        const essayScore = parseInt(evaluation.score, 10) || 0;
        finalScore = (total_score_mc * 0.8) + (essayScore * 0.2);
        unifiedFeedback = `--- Retroalimentación de Escritura ---\n${evaluation.feedback}\n\n--- Retroalimentación General ---\n${mcFeedback}`;
      } catch (geminiError) { console.error("⚠️ Error Gemini (General):", geminiError.message); }

      await saveSimulationAttempt(attempt_id, user_id, simulation_id, formatDate(start_time), formatDate(end_time), Math.round(finalScore), status, unifiedFeedback);
      
      console.log(`📝 Guardando ${user_answers.length} respuestas para el intento ${attempt_id}...`);
      for (const answer of user_answers) { await saveUserAnswer(attempt_id, answer); }
      console.log("✅ Respuestas individuales guardadas.");

      return res.status(200).json({ message: "Prueba General evaluada.", retroalimentation: unifiedFeedback, score: Math.round(finalScore) });

    } else if (isWrittenTest) {
      console.log("📝 Lógica Prueba de Escritura.");
      const essayText = user_answers[0].answer_text;
      let finalScore = 0;
      let retroalimentation = "La retroalimentación de la IA no está disponible. La prueba se ha guardado correctamente.";

      try {
        const evaluation = await evaluateWrittenCommunication(essayText);
        finalScore = parseInt(evaluation.score, 10) || 0;
        retroalimentation = evaluation.feedback;
      } catch (geminiError) { console.error("⚠️ Error Gemini (Escritura):", geminiError.message); }

      await saveSimulationAttempt(attempt_id, user_id, simulation_id, formatDate(start_time), formatDate(end_time), finalScore, status, retroalimentation);
      
      console.log(`📝 Guardando ${user_answers.length} respuesta para el intento ${attempt_id}...`);
      for (const answer of user_answers) { await saveUserAnswer(attempt_id, answer); }
      console.log("✅ Respuesta individual guardada.");

      return res.status(200).json({ message: "Prueba de escritura evaluada.", retroalimentation: retroalimentation, score: finalScore });

    } else {
      console.log("✅ Lógica Prueba de Opción Múltiple.");
      const { total_score } = req.body;
      let retroalimentation = "La retroalimentación de la IA no está disponible. La prueba se ha guardado correctamente.";

      try {
        const answers = [];
        for (const i of user_answers) {
          const answerStatement = await getAnswerById(i.selected_option_id);
          const questionStatement = await getQuestionById(i.question_id);
          answers.push({ questionStatement: questionStatement?.statement, answerStatement: answerStatement?.option_text, isCorrect: i.is_correct, questionScore: i.question_score });
        }
        const validAnswers = answers.filter(a => a.answerStatement !== "No respondida");
        if (validAnswers.length > 0) {
          retroalimentation = await retroalimentateTest(JSON.stringify(validAnswers, null, 2));
        }
      } catch (geminiError) { console.error("⚠️ Error Gemini (Opción Múltiple):", geminiError.message); }
      
      await saveSimulationAttempt(attempt_id, user_id, simulation_id, formatDate(start_time), formatDate(end_time), total_score, status, retroalimentation);
      
      console.log(`📝 Guardando ${user_answers.length} respuestas para el intento ${attempt_id}...`);
      for (const answer of user_answers) { await saveUserAnswer(attempt_id, answer); }
      console.log("✅ Respuestas individuales guardadas.");
      
      return res.status(200).json({ message: "Prueba realizada con éxito", retroalimentation, score: total_score });
    }
  } catch (err) {
    console.error("❌ Error CRÍTICO en saveSimulationAttemptHandler:", err);
    return res.status(500).json({ message: "Hubo un error grave e inesperado en el servidor.", error: err.message });
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
    if (!userId) return res.status(401).json({ message: "Usuario no autenticado." });
    const attemptsData = await getTestsByUserId(userId);
    if (!attemptsData || attemptsData.length === 0) return res.status(200).json({ averageScore: 0, attempts: [] });

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
        return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
    };

    const attempts = attemptsData.map(attempt => ({
      id: attempt.attempt_id,
      examName: attempt.simulation_name,
      score: attempt.total_score,
      level: getLevel(attempt.total_score),
      time: formatDuration(attempt.start_time, attempt.end_time),
      start_time: attempt.start_time,
      results: null 
    }));

    return res.status(200).json({ averageScore: Math.round(averageScore), attempts });
  } catch (err) {
    console.error("Error en getStudentTestsHandler:", err);
    return res.status(500).json({ message: "Hubo un error al obtener el historial de pruebas." });
  }
};

const getAttemptDetailsHandler = async (req, res) => {
  try {
    const { id: attemptId } = req.params;
    const attempt = await getAttemptById(attemptId);
    if (!attempt) return res.status(404).json({ message: "Intento no encontrado." });

    const userAnswers = await getUserAnswersByAttemptId(attemptId);

    const getLevel = (score) => {
        if (score > 220) return 'Nivel 4';
        if (score > 165) return 'Nivel 3';
        if (score > 145) return 'Nivel 2';
        return 'Nivel 1';
    };
    const formatDuration = (start, end) => {
        if (!start || !end) return 'N/A';
        const durationMs = new Date(end) - new Date(start);
        if (durationMs < 0) return '0s';
        const seconds = Math.floor((durationMs / 1000) % 60);
        const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    };

    const resultsPayload = {
      examName: attempt.simulation_name,
      generalFeedback: attempt.feedback,
      timeTaken: formatDuration(attempt.start_time, attempt.end_time),
      finalScore: attempt.total_score,
      level: getLevel(attempt.total_score),
      questions: userAnswers.map((q) => {
          const optionsWithLabels = (q.options || []).map((opt, i) => ({ ...opt, label: String.fromCharCode(65 + i) }));
          const userAnswerObject = optionsWithLabels.find(opt => opt.option_id === q.selected_option_id);
          const correctAnswerObject = optionsWithLabels.find(opt => opt.is_correct);
          return { 
            question_id: q.question_id, 
            statement: q.statement,
            image_path: q.image_path,
            user_answer: {
              selectedOption: q.selected_option_id,
              optionText: userAnswerObject ? `${userAnswerObject.label}) ${userAnswerObject.option_text}` : (q.answer_text || "No respondida")
            },
            correct_answer: {
              optionId: correctAnswerObject?.option_id,
              optionText: correctAnswerObject ? `${correctAnswerObject.label}) ${correctAnswerObject.option_text}` : "Revisión por IA"
            }
          };
      })
    };
    return res.status(200).json(resultsPayload);
  } catch (err) {
    console.error("Error en getAttemptDetailsHandler:", err);
    return res.status(500).json({ message: "Error al obtener los detalles." });
  }
};

export {
  saveSimulationAttemptHandler,
  saveSimulationHandler,
  saveSimulationQuestionsHandler,
  getTestsByUserHandler,
  getSimulationAttemptsHandler,
  getStudentTestsHandler,
  getAttemptDetailsHandler,
};