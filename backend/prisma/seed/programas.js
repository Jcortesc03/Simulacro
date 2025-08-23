import { PrismaClient } from '../../generated/prisma/index.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const programs = [
    "Administración de Empresas",
    "Arquitectura",
    "Comunicación Social",
    "Contaduría Pública",
    "Derecho",
    "Ingeniería Industrial",
    "Ingeniería de Sistemas",
    "Ingeniería de Software",
    "Psicología",
    "Medicina Veterinaria y Zootecnia"
  ];

  for (const program of programs) {
    await prisma.programs.upsert({
      where: { program_name: program },
      update: {},
      create: {
        program_id: uuidv4(),
        program_name: program,
      },
    });
  }

}
console.log("Programas insertados correctamente :)");
main()
  .catch((e) => {
    console.error("Error al insertar programas :(", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
