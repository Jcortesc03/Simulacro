import { PrismaClient } from '../../generated/prisma/index.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const programs = [
    {
      simulation_name: "Lectura Crítica",
      description: "Competencia para comprender, interpretar y evaluar textos."
    },
    {
      simulation_name: "Razonamiento Cuantitativo",
      description: "Competencia para utilizar conceptos y procedimientos matemáticos en la solución de problemas."
    },
    {
      simulation_name: "Competencias Ciudadanas",
      description: "Competencia para ejercer la ciudadanía y convivir de manera inclusiva en un marco de respeto por los derechos humanos."
    },
    {
      simulation_name: "Inglés",
      description: "Competencia para comunicarse efectivamente en inglés."
    },
    {
      simulation_name: "Escritura",
      description: "Competencia para producir textos escritos coherentes y bien argumentados."
    }
  ];

  for (const program of programs) {
    await prisma.simulations.upsert({
      where: { simulation_name: program.simulation_name },
      update: {},
      create: {
        simulation_id: uuidv4(),
        simulation_name: program.simulation_name,
        description: program.description,
        creation_date: new Date(),
        is_active: true
      },
    });
  }

}
console.log("Simulaciones insertados correctamente :)");
main()
  .catch((e) => {
    console.error("Error al insertar simulaciones :(", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
