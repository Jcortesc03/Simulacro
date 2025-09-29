import genAI from '../config/gemini.js';

const generateQuestion = async (topic, subtopic, difficulty, pastQuestions, questionNumbers) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
  Eres una IA especializada en crear preguntas tipo prueba Saber PRO, el examen que se realiza a universitarios en Colombia para evaluar su nivel académico.
  Tu tarea es generar ${questionNumbers} preguntas de dificultad: ${difficulty} en formato JSON, siguiendo estrictamente esta estructura:
  {
    "statement": "Enunciado de la pregunta",
    "option_A": "Texto de la opción A",
    "option_B": "Texto de la opción B",
    "option_C": "Texto de la opción C",
    "option_D": "Texto de la opción D",
    "Correct_Answer": "Letra de la opción correcta (A, B, C o D)"
  }
  **Categoría:** ${topic}
  **Subcategoría:** ${subtopic}
  Si no tienes suficiente conocimiento sobre el tema, devuelve exactamente un JSON vacío: '{}'.
  A continuación te dejo 5 ejemplos en el mismo formato para que los tomes como guía:
  ${pastQuestions}
  Devuelve solo el JSON, sin explicaciones ni texto adicional.
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json"
    }
  });

  const response = await result.response.text();
  return JSON.parse(response); 
};

const evaluateQuestion = async (subject, question, answer) =>  {

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `Eres una IA especializada en evaluar respuestas de un simulacro saber PRO, el exámen realizado a universitarios en Colombia para conocer su nivel académico.
  Tu tarea es evaluar la respuesta de un estudiante, la materia es :${subject} y la pregunta es: ${question}
  La respuesta es: ${answer}
  Como respuesta dame solo un formato JSON con 2 campos: "nota" y "retroalimentación".
    "nota": Un valor del 1.0 al 5.0 con máximo 2 décimales, según la calidad, precisión, argumentación y claridad de la respuesta.
    "retroalimentación": un texto de entre 20 y 100 palabras donde expliques de manera crítica y asertiva que aspectos podría mejorar o reforzar el estudiante.
    No incluyas explicaciones adicionales fuera del JSON.
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json"
    }
  });

  const response = await result.response.text();
  return JSON.parse(response);
};

const retroalimentateTest = async (test) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
  Eres una inteligencia artificial especializada en evaluar respuestas de simulacros del examen Saber PRO, una prueba estandarizada aplicada a universitarios en Colombia para medir competencias genéricas y específicas.
  Tu tarea es analizar el siguiente conjunto de respuestas, que se encuentra en formato JSON:
  ${test}
  Genera una retroalimentación escrita en un tono académico y constructivo, de máximo 500 palabras. En tu análisis, identifica los puntos fuertes y débiles del desempeño evidenciado en la prueba. Puedes referirte a aspectos como comprensión lectora, razonamiento cuantitativo, comunicación escrita, competencias ciudadanas, o cualquier otra área evaluada según el contenido del JSON.
  Si lo consideras pertinente, incluye 1 o 2 recursos de apoyo, en forma de links válidos y completos (por ejemplo, páginas web reconocidas o videos de YouTube).
  ⚠️ Importante: si no puedes garantizar que un enlace sea real y vigente, no inventes ninguno.
  No incluyas encabezados ni repitas el contenido del JSON. Solo entrega el análisis como un texto continuo.
  `;
  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  return response;
};

const evaluateWrittenCommunication = async (studentText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
  Eres un experto evaluador de ensayos para la prueba Saber PRO de Colombia, especializado en el módulo de Comunicación Escrita.
  Tu tarea es analizar el siguiente texto escrito por un estudiante:
  ---
  ${studentText}
  ---
  Proporciona tu evaluación estrictamente en formato JSON, con la siguiente estructura y sin texto adicional antes o después:
  {
    "score": "Un puntaje numérico entero entre 0 y 300",
    "feedback": "Una retroalimentación constructiva y detallada de máximo 250 palabras, explicando las fortalezas y debilidades del texto y cómo podría mejorarlo. El tono debe ser académico y orientador."
  }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: "application/json" 
      }
    });

    const response = await result.response.text();
    return JSON.parse(response);
  } catch (error) {
    console.error("❌ Error en la llamada a Gemini o al parsear la respuesta:", error.message);
    // Manejo de error mejorado.
    return {
      score: 0,
      feedback: `Error del sistema: ${error.message}`
    };
  }
};

export { generateQuestion, evaluateQuestion, retroalimentateTest, evaluateWrittenCommunication };
