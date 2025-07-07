import Questions from '../database/questions.js';
import generateQuestion  from '../services/geminiService.js'

const generateQuestionHandler = async (req, res) => {
    const { topic,subtopic, difficulty, questionNumbers } = req.body;

    if (!topic) return res.status(400).json({ error: "Topic is required" });

    try {
        const pastQuestions = await Questions.getLastQuestions();
        const rawText = await generateQuestion(topic, subtopic, difficulty, pastQuestions , questionNumbers);

        // Regex para extraer el JSON limpio si viene envuelto en backticks
        const regex = /```json\n([\s\S]*?)\n```/;
        const match = rawText.match(regex);

        let jsonToParse = rawText;

        if (match && match[1]) {
            jsonToParse = match[1];
        }

        const questions = JSON.parse(jsonToParse);
        
        return res.status(200).json({ questions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error generando la pregunta" });
    }
};

export default { generateQuestionHandler };