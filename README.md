# Simulacro Pruebas Saber Pro

Este repositorio contiene el código fuente para la plataforma de simulacros de las pruebas Saber Pro. La aplicación está diseñada para ofrecer una experiencia interactiva y educativa a estudiantes, con herramientas de gestión para profesores y administradores.

## Arquitectura del Proyecto

El proyecto está dividido en dos componentes principales: un frontend construido con React y un backend construido con Node.js y Express.

```mermaid
graph TD
    subgraph "User's Browser"
        A[React Frontend]
    end

    subgraph "Server"
        B[Node.js/Express Backend]
    end

    subgraph "Database"
        C[MySQL]
    end

    subgraph "External Services"
        D[Google Gemini API]
    end

    A -- "HTTP Requests (API Calls)" --> B
    B -- "Database Queries (Prisma)" --> C
    B -- "API Calls" --> D
```

## Características Principales

### Para Estudiantes
- **Panel de Inicio:** Vista rápida de estadísticas y simulacros recientes.
- **Realización de Simulacros:** Pruebas cronometradas por áreas de conocimiento.
- **Resultados Detallados:** Visualización de respuestas correctas e incorrectas.
- **Medidor de Desempeño:** Gráficos que muestran el rendimiento histórico.
- **Recomendaciones con IA:** Feedback personalizado basado en el puntaje obtenido para enfocar el estudio.

### Para Profesores
- **Gestión de Preguntas:** Añadir y editar preguntas dentro de las categorías asignadas.
- **Visualización de Simulacros:** Acceso a los bancos de preguntas y simulacros existentes.
- **Seguimiento (Futuro):** Posibilidad de ver el progreso de sus estudiantes.

### Para Administradores
- **Dashboard General:** Métricas clave de la plataforma.
- **Gestión de Usuarios:** Crear, ver, editar y eliminar cualquier usuario. Asignación de roles.
- **Gestión de Contenido:** Control total (CRUD) sobre las preguntas, categorías y simulacros.

## Stack Tecnológico

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS
- **Comunicación API:** Axios
- **Gestión de Estado:** React Context API
- **Routing:** React Router DOM
- **Linting:** ESLint

### Backend
- **Plataforma:** Node.js
- **Framework:** Express.js
- **Base de Datos:** MySQL
- **ORM:** Prisma
- **Autenticación:** JSON Web Tokens (JWT)
- **Validación:** express-validator
- **IA Generativa:** Google Gemini API
- **Variables de Entorno:** dotenv

## Getting Started

### Prerrequisitos
- Node.js (v18 o superior)
- npm o bun
- MySQL

### Backend Setup

1.  **Navegar a la carpeta del backend:**
    ```bash
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
    El servidor estará disponible en `http://localhost:3000`.

### Frontend Setup

1.  **Navegar a la carpeta del frontend:**
    ```bash
    cd frontend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz de `/frontend`.
    ```
    VITE_API_URL=http://localhost:3000/api
    ```

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## Documentación Detallada

### Backend

#### Arquitectura del Backend

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

#### Base de Datos

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

#### API Endpoints

-   **Autenticación (`/api/auth`)**
    -   `POST /login`: Inicia sesión y devuelve un JWT.
    -   `POST /register`: Registra un nuevo usuario.
    -   `GET /verify/:token`: Verifica el correo de un usuario.
    -   `PATCH /changePassword`: Cambia la contraseña del usuario autenticado. **(Protegido: Todos los roles)**
    -   `GET /profile`: Obtiene el perfil del usuario autenticado. **(Protegido: Todos los roles)**
-   **Administrador (`/api/admin`)**
    -   `DELETE /deleteUser`: Elimina un usuario. **(Protegido: ADMIN)**
    -   `PATCH /changeRole`: Cambia el rol de un usuario. **(Protegido: ADMIN)**
    -   `POST /adminRegister`: Crea un nuevo usuario como administrador. **(Protegido: ADMIN)**
    -   `GET /getPagedUsers`: Obtiene una lista paginada de todos los usuarios. **(Protegido: ADMIN)**
    -   `GET /getUserByEmail/:email`: Obtiene un usuario por su email. **(Protegido: ADMIN)**
    -   `GET /getCategories`: Obtiene todas las categorías. **(Protegido: ADMIN)**
    -   `GET /subcategories`: Obtiene todas las subcategorías. **(Protegido: ADMIN)**
-   **Preguntas (`/api/questions`)**
    -   `POST /saveQuestion`: Crea una nueva pregunta. **(Protegido: ADMIN)**
    -   `POST /saveQuestion1`: Crea una nueva pregunta. **(Protegido: TEACHER)**
    -   `GET /getQuestions`: Obtiene todas las preguntas. **(Protegido: Todos los roles)**
    -   `DELETE /:id`: Elimina una pregunta. **(Protegido: ADMIN)**
    -   `PUT /:id`: Actualiza una pregunta. **(Protegido: ADMIN)**
-   **Categorías (`/api/categories`)**
    -   `GET /`: Obtiene todas las categorías. **(Protegido: Todos los roles)**
    -   `GET /subcategories`: Obtiene todas las subcategorías. **(Protegido: Todos los roles)**
-   **Simulacros (`/api/tests`)**
    -   `POST /saveSimulation`: Guarda un nuevo simulacro. **(Protegido: TEACHER)**
    -   `POST /saveSimulationAttempt`: Guarda un intento de simulacro. **(Protegido: Todos los roles)**
    -   `POST /saveSimulationQuestion`: Guarda las preguntas de un simulacro. **(Protegido: ADMIN)**
    -   `POST /getSimulations`: Obtiene los simulacros de un usuario. **(Protegido: Todos los roles)**
    -   `GET /allSimulations`: Obtiene todos los intentos de simulacro. **(Protegido: Todos los roles)**
-   **Inteligencia Artificial (`/api/ai`)**
    -   `POST /generateQuestion`: Genera una nueva pregunta usando IA. **(Protegido: TEACHER)**
    -   `GET /evaluateQuestion`: Evalúa una pregunta usando IA. **(Protegido: Todos los roles)**
    -   `GET /getRetroalimentation`: Obtiene retroalimentación de un test usando IA. **(Protegido: Todos los roles)**

### Frontend

#### Diagrama de Flujo de Usuario

```mermaid
graph TD
    A[Usuario] --> B{Inicio de Sesión / Registro};
    B --> C{Autenticado?};
    C -- No --> B;
    C -- Sí --> D{Rol?};

    D -- Estudiante --> E[Panel de Estudiante];
    E --> F[Iniciar Simulación];
    F --> G[Realizar Prueba por Área];
    G --> H[Ver Resultados];
    H --> I[Recibir Recomendación de IA];

    D -- Profesor --> J[Panel de Profesor];
    J --> K[Ver Simulacros Disponibles];
    J --> L[Gestionar Preguntas];
    L --> M[Añadir/Editar Preguntas en sus Áreas];

    D -- Administrador --> N[Panel de Administrador];
    N --> O[Gestión de Usuarios];
    O --> P[Crear/Editar Roles y Permisos];
    N --> Q[Gestión de Simulacros];
    N --> R[Gestión Global de Preguntas];
    R --> S[CRUD Completo de Preguntas];
```

#### Estructura del Proyecto

```
/src
├───api/              # Configuración central de Axios para la comunicación con el backend.
├───assets/           # Imágenes, logos y otros recursos estáticos.
├───components/       # Componentes reutilizables de la UI.
│   ├───dashboard/    # Componentes específicos del panel de control.
│   ├───layout/       # Estructuras principales (Sidebar, Layouts por rol).
│   ├───questions/    # Componentes para mostrar y gestionar preguntas.
│   ├───simulation/   # Componentes para la experiencia del simulacro (Timer, etc.).
│   └───ui/           # Componentes genéricos de UI (Botones, Modales, Cards).
├───context/          # Contexto de React para la gestión del estado global (ej. estado del simulacro).
├───data/             # Datos estáticos o mockups.
├───pages/            # Vistas principales de la aplicación, organizadas por rol.
│   ├───admin/
│   ├───auth/
│   ├───student/
│   └───teacher/
├───routes/           # Definición de las rutas de la aplicación y protección por roles.
└───style/            # Archivos de estilos globales como index.css.
```

## Estado Actual y Trabajo Futuro

### Implementado
-   Toda la API RESTful descrita anteriormente está implementada y funcional.
-   Sistema completo de autenticación y autorización por roles usando JWT.
-   Integración con Prisma ORM para todas las operaciones CRUD.
-   Servicio de IA con Gemini para generar recomendaciones.
-   Seeding de base de datos para un arranque rápido.
-   Flujo de Autenticación completo para los tres roles.
-   Funcionalidad completa para la realización de simulacros.

### Pendiente / Por Hacer
-   **Recuperación de Contraseña:** Implementar la lógica y los endpoints para que los usuarios puedan restablecer su contraseña.
-   **Endpoint de Historial de Notas:** Crear un endpoint para que un estudiante pueda consultar todos sus resultados pasados.
-   **Testing:** Escribir pruebas de integración y unitarias para asegurar la fiabilidad de la aplicación.
-   **Documentación de API:** Generar documentación automática usando herramientas como Swagger o OpenAPI.
-   **Refinamiento Final de UI/UX:** Realizar ajustes menores en la interfaz para mejorar la experiencia de usuario general.

---
## Licencia

Repositorio Privado. Todos los derechos reservados.
