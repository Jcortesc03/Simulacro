import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const simulations = [
    {
      simulation_id: "a1d9d539-7e2a-4541-a88d-8fabd6607546",
      simulation_name: "Lectura Crítica",
      description: "Competencia para comprender, interpretar y evaluar textos.",
    },
    {
      simulation_id: "a0359b39-a3df-4bb3-a1c4-4befcbbc8a1f",
      simulation_name: "Razonamiento Cuantitativo",
      description: "Competencia para utilizar conceptos y procedimientos matemáticos en la solución de problemas.",
    },
    {
      simulation_id: "f869d2ae-37f2-4c80-ab60-2313eaf8a8b2",
      simulation_name: "Competencias Ciudadanas",
      description: "Competencia para ejercer la ciudadanía y convivir de manera inclusiva en un marco de respeto por los derechos humanos.",
    },
    {
      simulation_id: "2939efbb-a07a-409c-a50d-a68404f9ce28",
      simulation_name: "Inglés",
      description: "Competencia para comunicarse efectivamente en inglés.",
    },
    {
      simulation_id: "d7783d93-703a-4adb-af63-20dbe3adcf12",
      simulation_name: "Escritura",
      description: "Competencia para producir textos escritos coherentes y bien argumentados.",
    },
    {
      simulation_id: "d7783d93-703a-4adb-af63-20dbe3adcf13",
      simulation_name: "General",
      description: "Simulacro general",
    },
  ];

  for (const sim of simulations) {
    await prisma.simulations.upsert({
      where: { simulation_id: sim.simulation_id },
      update: {},
      create: {
        ...sim,
        creation_date: new Date(),
        is_active: true,
      },
    });
  }
}

main()
  .then(() => console.log("Simulaciones insertadas :D"))
  .catch((e) => console.error("Error al insertar simulaciones->", e))
  .finally(async () => await prisma.$disconnect());
