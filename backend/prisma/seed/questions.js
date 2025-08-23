// scripts/importQuestions.js
import { PrismaClient } from '../../generated/prisma/index.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, 'data', 'exported', 'questions.json');
  const questionsData = JSON.parse(await fs.readFile(dataPath, 'utf8'));

  for (const question of questionsData) {
    // Inserta la pregunta
    await prisma.questions.upsert({
      where: { question_id: question.question_id },
      update: {},
      create: {
        question_id: question.question_id,
        sub_category_id: question.sub_category_id,
        statement: question.statement,
        question_type: question.question_type,
        image_path: question.image_path,
        creation_date: question.creation_date ? new Date(question.creation_date) : new Date(),
        ai_generated: Boolean(question.ai_generated),
        difficulty: question.difficulty || 'medium',
        justification: question.justification,
        status: question.status || 'draft'
      }
    });

    // Inserta las respuestas
    if (question.answers && question.answers.length > 0) {
      for (const answer of question.answers) {
        await prisma.answer_options.upsert({
          where: { option_id: answer.option_id },
          update: {},
          create: {
            option_id: answer.option_id,
            question_id: question.question_id,
            option_text: answer.option_text,
            is_correct: Boolean(answer.is_correct)
          }
        });
      }
    }
  }
}
console.log("Se insertaron las preguntas :)")

main()
  .catch((e) => {
    console.error("Error al importar preguntas :(", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
