import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  try {
    await import("./roles.js");
    await delay(3000);

    await import("./programas.js");
    await delay(3000);

    await import("./users.js");
    await delay(3000);

    await import("./simulations.js")
    await delay(3000)

    await import("./simulations.students.js")
    await delay(3000)

    await import("./categories.js");
    await delay(7000);

    await import("./questions.js");
  } catch (err) {
    console.error("Error ejecutando seeds:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
