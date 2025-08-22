// backend/prisma/seed/roles.js
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      role_id: "3",
      role_name: "admin",
      role_description: "Administrador del sistema"
    },
    {
      role_id: "2",
      role_name: "teacher",
      role_description: "Profesor encargado de crear y gestionar preguntas"
    },
    {
      role_id: "1",
      role_name: "student",
      role_description: "Usuario que presenta simulacros y exámenes"
    }
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { role_name: role.role_name },
      update: {},
      create: {
        role_id: role.role_id,
        role_name: role.role_name,
        role_description: role.role_description
      }
    });
  }

  console.log("Roles insertados con IDs fijos (1, 2, 3) :)");
}

main()
  .catch((e) => {
    console.error("Error al insertar roles :(", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
