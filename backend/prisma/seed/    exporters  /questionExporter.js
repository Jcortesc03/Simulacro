import { getAllQuestions } from '../../../database/questions.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exportDataForSeeding = async () => {
  const exportDir = path.join(__dirname, '..', 'data', 'exported');
  await fs.mkdir(exportDir, { recursive: true });

  const questions = await getAllQuestions();

  const formattedQuestions = questions.map(question => ({
    question_id: question.question_id,
    statement: question.statement,
    question_type: question.question_type,
    image_path: question.image_path,
    creation_date: question.creation_date,
    ai_generated: question.ai_generated,
    difficulty: question.difficulty,
    justification: question.justification,
    status: question.status,
    sub_category_id: question.sub_category_id,
    answers: question.answers.map(answer => ({
      option_id: answer.option_id,
      option_text: answer.option_text,
      is_correct: answer.is_correct
    }))
  }));

  await fs.writeFile(
    path.join(exportDir, 'questions.json'),
    JSON.stringify(formattedQuestions, null, 2)
  );
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  exportDataForSeeding().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { exportDataForSeeding };
