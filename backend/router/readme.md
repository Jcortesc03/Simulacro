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

    Ejemplo para probar /auth/login (post):
        Esta ruta se usa para que el usuario inicie sesión

        {
            "email": "emailEjemplo@gmail.com",
            "password": "123456"
        }


    Ejemplo para probar /auth/getSubjects (get):
        Esta ruta se usa para obtener las materias de la db:
            /auth/getSubjects

    Ejemplo para probar /auth/changePassword (patch)
        {
            "email": "correoDeEjemplo@dominio.io",
            "newPassword":"654321"
        }

testsRoutes:
    /tests/saveSimulationAttempt(Post):
        {
            "attempt_id": "550e8400-e29b-41d4-a716-446655440000",
            "user_id": "e8f7da83-8886-4a63-861e-fe405c259108",
            "simulation_id": "lectura-critica",
            "start_time": "2025-07-31T11:30:00Z",
            "end_time": "2025-07-31T12:00:00Z",
            "total_score": 240,
            "status": "completed",
            "user_answers": [
                {
                "question_id": "00048679-5767-11f0-87f3-0897989b7c9d",
                "selected_option_id": "00069098-5767-11f0-87f3-0897989b7c9d",
                "is_correct": true,
                "question_score": 30
                },
                {
                "question_id": "007c67a0-60e4-11f0-939d-0897989b7c9d",
                "selected_option_id": "007f74e5-60e4-11f0-939d-0897989b7c9d",
                "is_correct": false,
                "question_score": 0
                },
                {
                "question_id": "0121851c-60f5-11f0-939d-0897989b7c9d",
                "selected_option_id": "0006bbe1-5767-11f0-87f3-0897989b7c9d",
                "is_correct": true,
                "question_score": 50
                },
                {
                "question_id": "01554d0b-569a-11f0-8239-0897989b7c9d",
                "selected_option_id": "0006be5e-5767-11f0-87f3-0897989b7c9d",
                "is_correct": true,
                "question_score": 80
                },
                {
                "question_id": "0180ce97-5694-11f0-8239-0897989b7c9d",
                "selected_option_id": "0006c11e-5767-11f0-87f3-0897989b7c9d",
                "is_correct": false,
                "question_score": 0
                }
            ]
        }

    /tests/saveSimulation(post):
    necesita token de teacher
    {
        "simulationName": "lectura-critica",
        "description": "An lectura-critica simulation",
        "creationDate": "2025-07-31 11:30:00",
        "isActive": true
    }


    /tests/getSimulations(GET):
    Esta ruta se usa para obtener todas las pruebas y respuestas del usuario mediante su email
    necesita token de usuario
    {
        "userEmail":"correoDeEjemplo@dominio.io"
    }


adminRoutes:

    Ejemplo para probar /admin/changeRole (patch):
        Esta ruta se usa para cambiar el rol de un usuario, requiere rango admin
            {
                "email": "correoDeEjemplo@dominio.io@gmail.com",
                "roleName":"user"
            }

    Ejemplo para probar /admin/adminRegister (post):
        Esta ruta se usa para crear un usuario ya autenticado, requiere rango admin
        {
            "email": "emailEjemplo@dominio.io",
            "name": "Juan",
            "password": "123456",
            "programName": "Sistemas"
        }  
    
    Ejemplo para probar /admin/deleteUser (delete):
        Esta ruta se usa para eliminar un usuario, requiere rango admin
        {
            "email": "emailEjemplo@dominio.io"
        }
    
    Ejemplo para probar /admin/getPagedUsers?page=1&limit=1 (get):
        Esta ruta se usa para obtener los usuarios paginados, requiere rango admin

        después del ? van los parametros, page= es para el número de la página, & es para separar los parametros y limit= es para el numero de usuarios que se necesitan en la lista que retorna el back, esto devuelve un objeto con la siguiente estructura:
            { message, users} esto es importante para el destructuring
    
