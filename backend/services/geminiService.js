import genAI from '../config/gemini.js';

// Función helper para limpiar respuestas de Gemini que vienen con bloques de código markdown
const cleanJsonResponse = (response) => {
  let cleaned = response.trim();

  // Remover bloques de código markdown si existen
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  return cleaned.trim();
};

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
  try {
      const cleaned = cleanJsonResponse(response);
      const parsed = JSON.parse(cleaned);

      // Si el parseo fue exitoso, devuelve la CADENA JSON limpia
      return JSON.stringify(parsed);

  } catch (e) {
      console.error("Fallo al parsear respuesta de IA:", e);
      // Si falla, devuelve la cadena '{}' según tu prompt
      return '{}';
  } 
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
  const cleaned = cleanJsonResponse(response);
  return JSON.parse(cleaned);
};

const retroalimentateTest = async (test) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
  Eres un evaluador experto del examen Saber PRO de Colombia. Analiza los resultados de este simulacro y genera una retroalimentación constructiva.

  IMPORTANTE: Los datos vienen en formato JSON. Analiza el desempeño general del estudiante basándote en:
  - El número total de preguntas respondidas
  - El número de respuestas correctas vs incorrectas
  - El puntaje obtenido (question_score)
  - Las áreas de conocimiento evaluadas

  DATOS DEL SIMULACRO:
  ${test}

  INSTRUCCIONES PARA TU RESPUESTA:
  1. Escribe un análisis en español, máximo 400 palabras
  2. Usa un tono académico, constructivo y motivador
  3. Identifica fortalezas y áreas de mejora
  4. Organiza tu respuesta en 3 párrafos:
     - Párrafo 1: Resumen del desempeño general (porcentaje de aciertos, puntaje total)
     - Párrafo 2: Áreas fuertes y aspectos positivos
     - Párrafo 3: Áreas de mejora con recomendaciones específicas
  5. NO menciones IDs de preguntas (question_id)
  6. NO uses encabezados, solo texto continuo
  7. NO transcribas ni repitas el contenido del JSON
  8. Si quieres sugerir recursos, menciona solo tipos generales (ej: "videos educativos", "ejercicios de práctica") sin URLs específicas

  Entrega SOLO el texto de retroalimentación, sin ningún otro contenido.
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
    const cleaned = cleanJsonResponse(response);
    return JSON.parse(cleaned);
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
