Como probar los endpoints

La petición debe llevar 2 campos en los HEADERS
    Authorization: Bearer "Acá va el token que se obtiene en la ruta de /auth/login"
    Content-Type: application/json (si usan axios no hace falta)

AIRoutes:

    Ejemplo para probar el endpoint de /ai/generateQuestion (get):
        {
            "topic": "english",
            "subtopic": "grammar",
            "difficulty": "medium",
            "questionNumbers": 3
        }
    Ejemplo para probar el endpoint de /ai/evaluateQuestion (get):
        {
            "subject": "Lectura Crítica",
            "question": "Lea el siguiente fragmento:\n\n\"En Colombia, la informalidad laboral afecta a más del 50% de los trabajadores, lo cual implica falta de acceso a seguridad social, inestabilidad económica y bajos niveles de ahorro para la vejez. A pesar de los esfuerzos del gobierno, el crecimiento de la informalidad ha sido persistente en zonas rurales y entre jóvenes.\"\n\nCon base en el texto, ¿cuál es la principal consecuencia de la informalidad laboral en Colombia?",
            "answer": "La informalidad laboral hace que las personas ganen menos dinero, porque no tienen un trabajo fijo y eso las vuelve pobres. Además, el gobierno no puede ayudar a todos y por eso no hay mucha solución. Esto es especialmente malo en las ciudades grandes."
        }

questionRoutes:
    Ejemplo para probar el endpoint de /questions/saveQuestions (post):
    {
        "subCategoryId": "17e55df2-5688-11f0-8239-0897989b7c9d",
        "statement": "¿Cuál de las siguientes opciones representa mejor el concepto de economía circular?",
        "questionType": "multiple-choice",
        "imagePath": null,
        "creationDate": "2025-07-31T11:30:00Z",
        "aiGenerated": false,
        "difficulty": "medium",
        "justification": "La economía circular busca reducir el desperdicio reutilizando recursos.",
        "status": "active",
        "answers": 
            [
                { "option_text": "Producción masiva sin reciclaje", "isCorrect": false },
                { "option_text": "Reutilización de materiales y reducción de residuos", "isCorrect": true },
                { "option_text": "Consumo ilimitado de recursos naturales", "isCorrect": false },
                { "option_text": "Exportación de materias primas", "isCorrect": false }
            ]
    }

    Ejemplo para probar el endpoint de /questions/getQuestions (get):
    {
        "categoryName": "English",
        "questionNumber": 5 
    }

userRoutes:

    Ejemplo para probar /auth/register (Post):
        
        Esta ruta se usa para registrar al usuario
        {
            "email": "",
            "name": "",
            "password": "",
            "programName": "",
        }
    
    Ejemplo para probar /auth/adminRegister (Post):
        
        Esta ruta se usa para registrar al usuario
        {
            "email": "",
            "name": "",
            "password": "",
            "programName": "",
        }

    Ejemplo para probar /auth/login (post):
        Esta ruta se usa para que el usuario inicie sesión

        {
            "email": "emailEjemplo@gmail.com",
            "password": "123456"
        }