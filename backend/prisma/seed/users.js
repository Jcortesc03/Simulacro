import { PrismaClient } from '../../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  try {
    const programs = await prisma.programs.findMany();
    if (programs.length === 0) {
      throw new Error("No hay programas en la base de datos. Inserta programas primero.");
    }

    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    const sistemas = programs.find(p => p.program_name === "Ingeniería de Sistemas") || programs[0];

    await prisma.users.upsert({
      where: { email: "admin@saberpro.com" },
      update: {},
      create: {
        user_id: uuidv4(),
        user_name: "Administrador",
        email: "admin@saberpro.com",
        password_hash: adminPassword,
        role_id: "3",
        program_id: sistemas.program_id,
        registration_date: new Date(),
        verificated: true,
      },
    });

    console.log("\nUsuario admin insertado correctamente :)");


    for (let i = 1; i <= 19; i++) {
      const randomProgram = programs[Math.floor(Math.random() * programs.length)];
      await prisma.users.upsert({
        where: { email: `user${i}@saberpro.com` },
        update: {},
        create: {
          user_id: uuidv4(),
          user_name: `Usuario ${i}`,
          email: `user${i}@saberpro.com`,
          password_hash: userPassword,
          role_id: "1",
          program_id: randomProgram.program_id,
          registration_date: new Date(),
          verificated: false,
        },
      });
    }

    console.log("Usuarios insertados correctamente :)");
  } catch (e) {
    console.error("Error en usuarios:( ", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
