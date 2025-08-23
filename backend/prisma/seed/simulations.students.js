import { PrismaClient } from "../../generated/prisma/index.js";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // buscamos usuarios y simulacros existentes
  const users = await prisma.users.findMany();
  const simulations = await prisma.simulations.findMany();

  if (users.length === 0 || simulations.length === 0) {
    console.log("❌ No hay usuarios o simulacros registrados. Inserta esos datos primero.");
    return;
  }

  const attemptsData = [
    {
      attempt_id: uuidv4(),
      user_id: users[0].user_id,
      simulation_id: simulations[0].simulation_id,
      start_time: new Date("2024-08-01T10:00:00"),
      end_time: new Date("2024-08-01T11:00:00"),
      total_score: 87,
      status: "COMPLETED",
    },
    {
      attempt_id: uuidv4(),
      user_id: users[1].user_id,
      simulation_id: simulations[1].simulation_id,
      start_time: new Date("2024-08-05T09:30:00"),
      end_time: new Date("2024-08-05T10:30:00"),
      total_score: 72,
      status: "COMPLETED",
    },
    {
      attempt_id: uuidv4(),
      user_id: users[2].user_id,
      simulation_id: simulations[0].simulation_id,
      start_time: new Date("2024-08-10T14:00:00"),
      end_time: new Date("2024-08-10T15:00:00"),
      total_score: 95,
      status: "COMPLETED",
    },
    {
      attempt_id: uuidv4(),
      user_id: users[0].user_id,
      simulation_id: simulations[2].simulation_id,
      start_time: new Date("2024-08-12T08:00:00"),
      end_time: new Date("2024-08-12T09:15:00"),
      total_score: 60,
      status: "COMPLETED",
    },
    {
      attempt_id: uuidv4(),
      user_id: users[1].user_id,
      simulation_id: simulations[2].simulation_id,
      start_time: new Date("2024-08-15T16:00:00"),
      end_time: new Date("2024-08-15T17:10:00"),
      total_score: 81,
      status: "COMPLETED",
    },
  ];

  await prisma.simulation_attempts.createMany({
    data: attemptsData,
  });

  console.log("Se insertaron intentos de simulacros correctamente :)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
