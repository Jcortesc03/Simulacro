import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const categorias = [
    {
      category_id: "07fce3a1-5688-11f0-8239-0897989b7c9d",
      category_name: "Lectura Crítica",
      description: "Competencia para comprender, interpretar y evaluar textos."
    },
    {
      category_id: "07fe1768-5688-11f0-8239-0897989b7c9d",
      category_name: "Razonamiento Cuantitativo",
      description: "Competencia para utilizar conceptos y procedimientos matemáticos en la solución de problemas."
    },
    {
      category_id: "07fe199c-5688-11f0-8239-0897989b7c9d",
      category_name: "Competencias Ciudadanas",
      description: "Competencia para ejercer la ciudadanía y convivir de manera inclusiva en un marco de respeto por los derechos humanos."
    },
    {
      category_id: "07fe1a6b-5688-11f0-8239-0897989b7c9d",
      category_name: "Inglés",
      description: "Competencia para comunicarse efectivamente en inglés."
    },
    {
      category_id: "07fe1b19-5688-11f0-8239-0897989b7c9d",
      category_name: "Escritura",
      description: "Competencia para producir textos escritos coherentes y bien argumentados."
    },
    {
      category_id: "07fe1a6b-5688-11f0-8239-0897989b7c9e",
      category_name: "General",
      description: "Simulacro general"
    },
  ];

  await prisma.categories.createMany({
    data: categorias,
    skipDuplicates: true
  });

  const subcategorias = [
    {
      sub_category_id: "1258afca-5688-11f0-8239-0897989b7c9e",
      category_id: "07fe1a6b-5688-11f0-8239-0897989b7c9e",
      sub_category_name: "general",
      description: "Simulacro general"
    },
    {
      sub_category_id: "1258afca-5688-11f0-8239-0897989b7c9d",
      category_id: "07fce3a1-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Identificar y comprender elementos de un texto",
      description: "Identificación y comprensión de hechos, ideas, afirmaciones y otros elementos que componen un texto."
    },
    {
      sub_category_id: "1258c93a-5688-11f0-8239-0897989b7c9d",
      category_id: "07fce3a1-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Comprender la estructura y el sentido global de un texto",
      description: "Comprender cómo las partes de un texto se relacionan para darle un sentido global."
    },
    {
      sub_category_id: "1258ca77-5688-11f0-8239-0897989b7c9d",
      category_id: "07fce3a1-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Reflexionar y evaluar el contenido de un texto",
      description: "Reflexión y evaluación del contenido de un texto."
    },
    {
      sub_category_id: "15349b64-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1768-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Interpretación y representación de datos cuantitativos",
      description: "Interpretar y representar datos cuantitativos en diferentes formatos: tablas, gráficos, diagramas, etc."
    },
    {
      sub_category_id: "15357d77-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1768-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Formulación y ejecución de soluciones",
      description: "Formular y ejecutar la solución de un problema cuantitativo."
    },
    {
      sub_category_id: "15357ef8-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1768-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Argumentación sobre la validez de la solución",
      description: "Sustentar la validez de una solución propuesta a un problema cuantitativo."
    },
    {
      sub_category_id: "17e5200d-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe199c-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Pensamiento social",
      description: "Conocimiento de la Constitución Política de Colombia y del entorno social."
    },
    {
      sub_category_id: "17e55c04-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe199c-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Argumentación en contextos sociales",
      description: "Análisis de la validez de un discurso frente a un problema social."
    },
    {
      sub_category_id: "17e55df2-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe199c-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Multiperspectivismo",
      description: "Capacidad de observar un problema desde diferentes perspectivas."
    },
    {
      sub_category_id: "17e55e7d-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe199c-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Pensamiento sistémico",
      description: "Comprender la realidad social considerando todas sus dimensiones y evaluando la aplicabilidad de posibles soluciones."
    },
    {
      sub_category_id: "1b4541e9-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1a6b-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Comprensión de lectura de textos cortos",
      description: "Comprender información en textos cortos, directos, avisos y mensajes."
    },
    {
      sub_category_id: "1b463749-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1a6b-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Comprensión de lectura de textos largos",
      description: "Leer artículos y textos para comprender ideas principales, detalles específicos e inferencias."
    },
    {
      sub_category_id: "1b463931-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1a6b-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Gramática y vocabulario en contexto",
      description: "Completar conversaciones o textos seleccionando la forma gramatical o vocabulario correctos."
    },
    {
      sub_category_id: "1b463a6d-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1a6b-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Comprensión situacional y pragmática",
      description: "Comprender situaciones escritas u orales para determinar respuestas o significados adecuados."
    },
    {
      sub_category_id: "22d09519-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1b19-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Proposición textual",
      description: "Claridad y desarrollo de afirmaciones e ideas dentro del tema propuesto."
    },
    {
      sub_category_id: "22d0b73f-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1b19-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Organización textual",
      description: "Capacidad para expresar ideas de manera ordenada y cohesionada, usando secuencias, puntuación y conectores."
    },
    {
      sub_category_id: "22d0b86e-5688-11f0-8239-0897989b7c9d",
      category_id: "07fe1b19-5688-11f0-8239-0897989b7c9d",
      sub_category_name: "Expresión y argumentación",
      description: "Forma en que se sustenta una opinión y se presentan argumentos para justificar y explicar un punto de vista."
    }
  ];

  for (const sub of subcategorias) {
    const categoriaExiste = await prisma.categories.findUnique({
      where: { category_id: sub.category_id }
    });

    if (categoriaExiste) {
      await prisma.sub_categories.upsert({
        where: { sub_category_id: sub.sub_category_id },
        update: {},
        create: {
          sub_category_id: sub.sub_category_id,
          sub_category_name: sub.sub_category_name,
          description: sub.description,
          category_id: sub.category_id
        }
      });
    }
  }

  console.log("Categorías y subcategorías insertadas correctamente :)");
}

main()
  .catch((e) => {
    console.error("Error en categorías:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
