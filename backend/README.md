# Simulacro Pruebas Saber Pro - Backend

Este es el backend del proyecto Simulacro Saber Pro. Construido con Node.js y Express, proporciona una API RESTful para gestionar la lógica de negocio, la autenticación de usuarios, la interacción con la base de datos y la integración con servicios de IA.

## Arquitectura del Backend

El servidor sigue una arquitectura por capas para separar responsabilidades, haciendo el código más mantenible y escalable.

```mermaid
graph TD
    subgraph Cliente
        A[Frontend / Postman]
    end

    subgraph Servidor Express
        B(Entry Point: server.js)
        C{Router Principal}
        D[Middlewares Globales: CORS, JSON Parser, Rate Limiter]
        E{Rutas Específicas}
        F[Middlewares de Ruta: Autenticación y Autorización]
        G[Controladores]
        H[Lógica de Negocio]
    end

    subgraph Capa de Datos
        I(Prisma ORM)
        J[(Base de Datos MySQL)]
    end

    subgraph Servicios Externos
        K(Google Gemini API)
    end

    A --> B;
    B --> D;
    D --> C;
    C --> E;
    E --> F;
    F --> G;
    G --> H;
    H --> I;
    H --> K;
    I --> J;
```

**Flujo de una Petición:**
1.  Una petición HTTP llega al `server.js`.
2.  Pasa a través de middlewares globales (CORS, etc.).
3.  El router principal la dirige a la ruta específica (ej. `/api/users`).
4.  Se ejecutan middlewares de ruta, como `verifyToken` para autenticar y `verifyRole` para autorizar.
5.  Si la autenticación y autorización son exitosas, la petición llega al controlador correspondiente.
6.  El controlador procesa la petición, ejecuta la lógica de negocio y utiliza Prisma para interactuar con la base de datos.
7.  El controlador devuelve una respuesta JSON al cliente.

## Stack Tecnológico

-   **Plataforma:** Node.js
-   **Framework:** Express.js
-   **Base de Datos:** MySQL
-   **ORM:** Prisma
-   **Autenticación:** JSON Web Tokens (JWT)
-   **Validación:** express-validator
-   **IA Generativa:** Google Gemini API
-   **Variables de Entorno:** dotenv

## Base de Datos

La estructura de la base de datos se define en `prisma/schema.prisma`.

```mermaid
erDiagram
    users {
        String user_id PK
        String role_id FK
        String program_id FK
        String user_name
        String email
        String password_hash
        DateTime registration_date
        Boolean verificated
    }
    roles {
        String role_id PK
        String role_name
        String role_description
    }
    programs {
        String program_id PK
        String program_name
    }
    categories {
        String category_id PK
        String category_name
        String description
    }
    sub_categories {
        String sub_category_id PK
        String category_id FK
        String sub_category_name
        String description
    }
    questions {
        String question_id PK
        String sub_category_id FK
        String statement
        String question_type
        String image_path
        DateTime creation_date
        Boolean ai_generated
        questions_difficulty difficulty
        String justification
        questions_status status
    }
    answer_options {
        String option_id PK
        String question_id FK
        String option_text
        Boolean is_correct
    }
    simulations {
        String simulation_id PK
        String simulation_name
        String description
        DateTime creation_date
        Boolean is_active
    }
    simulation_attempts {
        String attempt_id PK
        String user_id FK
        String simulation_id FK
        DateTime start_time
        DateTime end_time
        Decimal total_score
        String status
    }
    simulation_questions {
        String simulation_question_id PK
        String simulation_id FK
        String question_id FK
        Int display_order
    }
    user_answers {
        String user_answer_id PK
        String attempt_id FK
        String question_id FK
        String selected_option_id FK
        String answer_text
        Boolean is_correct
        Decimal question_score
    }

    users ||--o{ simulation_attempts : "has many"
    users }|--|| roles : "belongs to"
    users }|--|| programs : "belongs to"
    sub_categories ||--|{ questions : "has many"
    categories ||--|{ sub_categories : "has many"
    questions ||--|{ answer_options : "has many"
    questions ||--o{ simulation_questions : "has many"
    questions ||--o{ user_answers : "has many"
    simulations ||--o{ simulation_attempts : "has many"
    simulations ||--o{ simulation_questions : "has many"
    simulation_attempts ||--o{ user_answers : "has many"
    answer_options ||--o{ user_answers : "can be"
```

## Middlewares Clave

Los middlewares son una parte fundamental de la seguridad y lógica de la aplicación.

### `verifyToken.js`
Este middleware protege las rutas que requieren autenticación. Su funcionamiento es:
1.  Extrae el token JWT del header `Authorization: Bearer <token>`.
2.  Verifica que el token sea válido usando el `JWT_SECRET`.
3.  Si es válido, decodifica el payload (que contiene el ID y rol del usuario) y lo adjunta al objeto `req` (ej. `req.user`).
4.  Si no hay token o no es válido, devuelve un error `401 Unauthorized`.

### `verifyRole.js`
Es un middleware de autorización que se usa *después* de `verifyToken`. 
1.  Es una función de orden superior que recibe un array de roles permitidos (ej. `['ADMIN', 'TEACHER']`).
2.  Compara el rol del usuario autenticado (`req.user.role`) con los roles permitidos.
3.  Si el rol del usuario está en la lista, permite el acceso. De lo contrario, devuelve un error `403 Forbidden`.

**Ejemplo de uso en una ruta:**
```javascript
// Solo los administradores pueden acceder a esta ruta
router.get('/users', verifyToken, verifyRole(['ADMIN']), userController.getAllUsers);
```

## Instalación y Puesta en Marcha

1.  **Clonar el repositorio y navegar a la carpeta:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz de `/backend` a partir de `.env.example`.
    ```dotenv
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
    JWT_SECRET="TU_SECRETO_PARA_JWT"
    GEMINI_API_KEY="TU_API_KEY_DE_GEMINI"
    ```

4.  **Aplicar migraciones de la base de datos:**
    ```bash
    npx prisma migrate dev
    ```

5.  **Poblar la base de datos con datos iniciales (opcional pero recomendado):**
    ```bash
    npx prisma db seed
    ```

6.  **Ejecutar el servidor:**
    ```bash
    npm run dev
    ```
    El servidor estará disponible en `http://localhost:3000` (o el puerto que configures).

## API Endpoints

A continuación se detallan los endpoints disponibles, agrupados por recurso.

--- 

### Autenticación (`/api/auth`)
-   `POST /login`: Inicia sesión y devuelve un JWT. Abierto a todos.
-   `POST /register`: Registra un nuevo usuario. Abierto a todos.
-   `GET /verify/:token`: Verifica el correo de un usuario. Abierto a todos.
-   `PATCH /changePassword`: Cambia la contraseña del usuario autenticado. **Protegido: Todos los roles.**
-   `GET /profile`: Obtiene el perfil del usuario autenticado. **Protegido: Todos los roles.**

--- 

### Administrador (`/api/admin`)
-   `DELETE /deleteUser`: Elimina un usuario. **Protegido: ADMIN.**
-   `PATCH /changeRole`: Cambia el rol de un usuario. **Protegido: ADMIN.**
-   `POST /adminRegister`: Crea un nuevo usuario como administrador. **Protegido: ADMIN.**
-   `GET /getPagedUsers`: Obtiene una lista paginada de todos los usuarios. **Protegido: ADMIN.**
-   `GET /getUserByEmail/:email`: Obtiene un usuario por su email. **Protegido: ADMIN.**
-   `GET /getCategories`: Obtiene todas las categorías. **Protegido: ADMIN.**
-   `GET /subcategories`: Obtiene todas las subcategorías. **Protegido: ADMIN.**

--- 

### Preguntas (`/api/questions`)
-   `POST /saveQuestion`: Crea una nueva pregunta. **Protegido: ADMIN.**
-   `POST /saveQuestion1`: Crea una nueva pregunta. **Protegido: TEACHER.**
-   `GET /getQuestions`: Obtiene todas las preguntas. **Protegido: Todos los roles.**
-   `DELETE /:id`: Elimina una pregunta. **Protegido: ADMIN.**
-   `PUT /:id`: Actualiza una pregunta. **Protegido: ADMIN.**

--- 

### Categorías (`/api/categories`)
-   `GET /`: Obtiene todas las categorías. **Protegido: Todos los roles.**
-   `GET /subcategories`: Obtiene todas las subcategorías. **Protegido: Todos los roles.**

--- 

### Simulacros (`/api/tests`)
-   `POST /saveSimulation`: Guarda un nuevo simulacro. **Protegido: TEACHER.**
-   `POST /saveSimulationAttempt`: Guarda un intento de simulacro. **Protegido: Todos los roles.**
-   `POST /saveSimulationQuestion`: Guarda las preguntas de un simulacro. **Protegido: ADMIN.**
-   `POST /getSimulations`: Obtiene los simulacros de un usuario. **Protegido: Todos los roles.**
-   `GET /allSimulations`: Obtiene todos los intentos de simulacro. **Protegido: Todos los roles.**

--- 

### Inteligencia Artificial (`/api/ai`)
-   `POST /generateQuestion`: Genera una nueva pregunta usando IA. **Protegido: TEACHER.**
-   `GET /evaluateQuestion`: Evalúa una pregunta usando IA. **Protegido: Todos los roles.**
-   `GET /getRetroalimentation`: Obtiene retroalimentación de un test usando IA. **Protegido: Todos los roles.**

## Estado Actual y Trabajo Futuro

### Implementado
-   Toda la API RESTful descrita anteriormente está implementada y funcional.
-   Sistema completo de autenticación y autorización por roles usando JWT.
-   Integración con Prisma ORM para todas las operaciones CRUD.
-   Servicio de IA con Gemini para generar recomendaciones.
-   Seeding de base de datos para un arranque rápido.

### Pendiente / Por Hacer
-   **Recuperación de Contraseña:** Implementar la lógica y los endpoints (`/api/auth/forgot-password`, `/api/auth/reset-password`) para que los usuarios puedan restablecer su contraseña. Esto requerirá la integración de un servicio de envío de correos como Nodemailer.
-   **Endpoint de Historial de Notas:** Crear un endpoint (ej. `GET /api/tests/history`) para que un estudiante pueda consultar todos sus resultados pasados de forma paginada.
-   **Testing:** Escribir pruebas de integración y unitarias (usando Jest o similar) para asegurar la fiabilidad de los endpoints y la lógica de negocio.
-   **Documentación de API:** Generar documentación automática usando herramientas como Swagger o OpenAPI para facilitar el consumo de la API.

---
## Licencia

Repositorio Privado. Todos los derechos reservados.
