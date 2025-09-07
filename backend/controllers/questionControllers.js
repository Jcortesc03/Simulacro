import { saveQuestion, getLastQuestions, deleteQuestion, updateQuestion, getAllCategoriesQuestions } from '../database/questions.js';

//------------------------------------------------------------------------------------------------------------------------------

const saveQuestionHandler = async (req, res) => {
    // Extraemos todos los posibles datos del cuerpo de la petición
    const {
        subCategoryId,
        statement,
        questionType,
        imagePath,
        creationDate,
        aiGenerated,
        difficulty,
        justification,
        status,
        answers
    } = req.body;

    console.log("-> Recibido en saveQuestionHandler:", req.body);

    // --- BLOQUE DE VALIDACIÓN DETALLADO ---
    // 1. Campos que son SIEMPRE obligatorios
    const baseFields = {
        subCategoryId,
        statement,
        questionType,
        creationDate,
        aiGenerated,
        difficulty,
        justification,
        status
    };

    // 2. Iteramos sobre los campos base para encontrar el que falta
    for (const [key, value] of Object.entries(baseFields)) {
        // Verificamos si el campo es undefined, null o una cadena vacía
        if (value === undefined || value === null || value === '') {
            const errorMessage = `Falta un dato requerido en el cuerpo de la petición: '${key}'`;
            console.error(`Error de validación (400): ${errorMessage}`);
            // Devolvemos un JSON claro para que el frontend lo pueda leer
            return res.status(400).json({ message: errorMessage });
        }
    }

    // 3. Validación condicional para el campo 'answers'
    if (questionType === 'multiple_choice') {
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            const errorMessage = 'Para preguntas de opción múltiple, se requiere un array de respuestas (answers).';
            console.error(`Error de validación (400): ${errorMessage}`);
            return res.status(400).json({ message: errorMessage });
        }
    }
    // --- FIN DEL BLOQUE DE VALIDACIÓN ---

    try {
        // Llamamos a la función de la base de datos con todos los datos
        const result = await saveQuestion(
            subCategoryId, statement, questionType, imagePath,
            creationDate, aiGenerated, difficulty, justification, status, 
            // Pasamos 'answers' solo si es de opción múltiple
            questionType === 'multiple_choice' ? answers : undefined 
        );
        
        // Devolvemos una respuesta de éxito con un JSON
        res.status(201).json({ message: 'Pregunta creada correctamente', data: result });
        
    } catch(err) {
        // Si hay un error en la capa de base de datos (p. ej., un error de SQL)
        console.error("!!! Error 500 en saveQuestionHandler al llamar a la BD:", err);
        res.status(500).json({ message: 'Hubo un error en el servidor al guardar la pregunta.', error: err.message });
    }
};

//------------------------------------------------------------------------------------------------------------------------------

const getLastQuestionsHandler = async (req, res) => {
    const { categoryName, questionNumber } = req.query; 
    const numQuestions = parseInt(questionNumber, 10);
    
    if (!categoryName || isNaN(numQuestions) || numQuestions <= 0)
        return res.status(400).json({ message: 'Faltan parámetros: categoryName y questionNumber (número válido)' });
    
    try {
        const result = await getLastQuestions(categoryName, numQuestions);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error en getLastQuestionsHandler:", err);
        res.status(500).json({ message: 'Hubo un error en el servidor', error: err.message });
    }
};

//------------------------------------------------------------------------------------------------------------------------------

const getAllCategoriesQuestionsHandler = async (req, res) =>{
    try {
        const questions = await getAllCategoriesQuestions();
        return res.status(200).json(questions); 
    } catch(err) {
        console.error("Error en getAllCategoriesQuestionsHandler:", err);
        return res.status(500).json({ message: 'Hubo un error obteniendo todas las preguntas', error: err.message });
    }
};

//------------------------------------------------------------------------------------------------------------------------------

const deleteQuestionHandler = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'El ID de la pregunta es requerido' });
    }
    
    try {
        const success = await deleteQuestion(id);
        if (success) {
            res.status(200).json({ message: 'Pregunta eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'La pregunta no fue encontrada' });
        }
    } catch (err) {
        console.error("Error en deleteQuestionHandler:", err);
        res.status(500).json({ message: 'Hubo un error al eliminar la pregunta', error: err.message });
    }
};

//------------------------------------------------------------------------------------------------------------------------------

const updateQuestionHandler = async (req, res) => {
    const { id } = req.params;
    const { statement, questionType, difficulty, justification, status, answers } = req.body;
    
    const baseFields = { statement, questionType, difficulty, justification, status };
    for (const [key, value] of Object.entries(baseFields)) {
        if (value === undefined || value === null || value === '') {
            return res.status(400).json({ message: `Falta el campo requerido para actualizar: ${key}` });
        }
    }

    if (questionType === 'multiple_choice' && (!answers || !Array.isArray(answers))) {
        return res.status(400).json({ message: 'Para actualizar una pregunta de opción múltiple, se requiere el array de respuestas (answers).' });
    }

    try {
        const result = await updateQuestion(id, req.body);
        if (result.success) {
            res.status(200).json({ message: 'Pregunta actualizada correctamente' });
        } else {
            res.status(404).json({ message: result.message || 'La pregunta no fue encontrada' });
        }
    } catch (err) {
        console.error("Error en updateQuestionHandler:", err);
        res.status(500).json({ message: 'Hubo un error al actualizar la pregunta', error: err.message });
    }
};

export { saveQuestionHandler, getLastQuestionsHandler, deleteQuestionHandler, updateQuestionHandler, getAllCategoriesQuestionsHandler };