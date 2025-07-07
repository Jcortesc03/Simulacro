import genAI from '../config/gemini.js';

const generateQuestion = async (topic, subtopic, difficulty, pastQuestions, questionNumbers) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

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
  `
  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  return response;
};

export default generateQuestion;