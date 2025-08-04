# Plataforma de Simulacros Saber Pro - Frontend

Este repositorio contiene el código fuente del frontend para la plataforma de simulacros de la prueba Saber Pro. La aplicación ha sido desarrollada con React y Vite, y está diseñada para ser una herramienta robusta, escalable y fácil de mantener, con una fuerte separación entre la lógica de la interfaz y los datos.

El objetivo principal es proporcionar una experiencia de usuario fluida y realista para estudiantes que se preparan para el examen, así como herramientas de gestión potentes para administradores y profesores.

---

## 🚀 Tecnologías y Dependencias Principales

Este proyecto se ha construido utilizando un stack de tecnologías moderno para asegurar un alto rendimiento y una excelente experiencia de desarrollo.

*   **Framework:** [React 18](https://react.dev/) - Para la construcción de la interfaz de usuario componentizada.
*   **Entorno de Desarrollo:** [Vite](https://vitejs.dev/) - Proporciona un servidor de desarrollo ultrarrápido con Hot Module Replacement (HMR) y un sistema de build optimizado.
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Un framework CSS "utility-first" que nos permite construir diseños complejos y responsives directamente en el JSX.
*   **Enrutamiento:** [React Router DOM](https://reactrouter.com/) - Para manejar la navegación entre las diferentes páginas y layouts de la aplicación.
*   **Llamadas a la API:** [Axios](https://axios-http.com/) - Cliente HTTP basado en promesas para realizar peticiones al backend (instalado y listo para usar).
*   **Gráficos y Visualización:** [Recharts](https://recharts.org/) - Librería de gráficos para React, usada para las estadísticas de rendimiento (instalada y lista para usar).
*   **Iconos:** [Lucide React](https://lucide.dev/) - Una librería de iconos SVG limpia, ligera y altamente personalizable.
*   **Internacionalización (i18n):** [i18next](https://www.i18next.com/) - Framework para hacer la aplicación multilingüe (instalado y configurado en el dashboard de admin).

---

## 📂 Estructura del Proyecto (Solo Frontend)

La estructura de carpetas está organizada por funcionalidad para facilitar la escalabilidad y el mantenimiento.
/
├── public/ # Archivos estáticos (imágenes, logos, archivos de idioma)
└── src/
├── assets/ # Recursos como imágenes, fuentes, etc.
├── components/ # Componentes de UI reutilizables
│ ├── dashboard/ # Componentes específicos para dashboards (StatsCard, etc.)
│ ├── layout/ # Componentes de Layout (Admin, Student, Auth, Sidebars)
│ ├── simulation/ # Componentes para la experiencia del simulacro (Timer, QuestionCard)
│ ├── teacher/ # Componentes exclusivos para el rol de profesor
│ └── ui/ # Componentes de UI genéricos (Button, Card, Modal)
├── context/ # Contextos de React para estado global (ej. SimulationContext)
├── data/ # Archivos con datos de ejemplo (mock data)
├── pages/ # Componentes que representan páginas completas
│ ├── admin/
│ ├── auth/
│ ├── student/
│ └── teacher/
├── App.jsx # Componente raíz y enrutador principal
├── main.jsx # Punto de entrada de la aplicación
└── index.css # Estilos globales y configuración de Tailwind


---

## 🏁 Cómo Empezar

Para poner en marcha el proyecto en un entorno de desarrollo local, sigue estos pasos.

### Pre-requisitos

-   [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada)
-   [npm](https://www.npmjs.com/) (generalmente viene con Node.js) o [Yarn](https://yarnpkg.com/)

### Pasos de Instalación

1.  **Clonar el repositorio:**
    Abre tu terminal y ejecuta el siguiente comando:
    ```bash
    git clone [URL_DEL_REPOSITORIO]
    cd [NOMBRE_DE_LA_CARPETA]
    ```

2.  **Instalar todas las dependencias del proyecto:**
    Este comando leerá el archivo `package.json` e instalará todas las librerías necesarias, incluyendo React, Vite y Tailwind CSS.
    ```bash
    npm install
    ```

3.  **Instalar dependencias adicionales (si no están en `package.json`):**
    El proyecto utiliza las siguientes librerías clave para funcionalidades específicas. Ejecuta este comando para asegurarte de tenerlas todas:

    *   `react-router-dom`: Para el manejo de rutas y navegación.
    *   `axios`: Para realizar peticiones a la API del backend.
    *   `recharts`: Para la creación de gráficos de estadísticas.
    *   `lucide-react`: Para la biblioteca de iconos.
    *   `i18next`, `react-i18next`, `i18next-http-backend`: Para la internacionalización (multi-idioma).

    ```bash
    npm install react-router-dom axios recharts lucide-react i18next react-i18next i18next-http-backend
    ```

4.  **Iniciar el servidor de desarrollo:**
    Una vez instaladas todas las dependencias, inicia la aplicación:
    ```bash
    npm run dev
    ```

    La aplicación estará disponible en la URL que aparezca en tu terminal (generalmente `http://localhost:5173`). El servidor se recargará automáticamente cada vez que guardes un cambio en el código.

---

## ✨ Funcionalidades Implementadas

A la fecha, hemos construido una base sólida con flujos completos para los roles de Administrador y Estudiante.

### 🔑 Autenticación
*   **Layout de Autenticación (`AuthLayout`):** Un marco visual consistente para las páginas de login y registro, con un fondo personalizado.
*   **Página de Login (`LoginPage`):** Formulario de inicio de sesión con una lógica de redirección simulada basada en el rol del usuario (`admin`, `teacher`, `student`).
*   **Página de Registro (`RegisterPage`):** Formulario de registro de nuevos usuarios.

### 👨‍💻 Dashboard de Administrador
*   **Layout y Navegación:** Un layout completo con una barra lateral responsive que se encoge en dispositivos móviles.
*   **CRUD de Usuarios (`UsersPage`, `UserFormPage`):** Flujo completo para ver, añadir, editar y eliminar usuarios, con un diseño responsive (tabla en desktop, tarjetas en móvil).
*   **Gestión de Categorías y Preguntas (`CategoriesPage`, `CategoryDetailPage`):**
    *   Visualización de categorías.
    *   Vista de detalle para ver las preguntas de una categoría.
    *   Funcionalidad para añadir y editar preguntas a través de un formulario en un modal, con manejo de scroll para contenido largo.
*   **Visualización de Simulacros (`SimulacrosPage`):** Una tabla responsive para ver los resultados de los simulacros realizados por los estudiantes.
*   **Internacionalización (i18n):** La barra lateral está preparada para ser multilingüe.

### 🎓 Dashboard de Estudiante
*   **Layout y Navegación:** Un layout independiente con una barra lateral responsive y enlaces específicos para el estudiante.
*   **Página de Inicio (`InicioPage`):** Una página de bienvenida visualmente atractiva con tarjetas en columnas que guían al usuario.
*   **Selección de Pruebas (`PruebasPage`):** Un menú con tarjetas horizontales para cada competencia y una tarjeta destacada para el simulacro general.
*   **Motor de Simulacro (`SimulationPage`):**
    *   **Personalización:** El estudiante puede elegir el número de preguntas.
    *   **Cronómetro:** Un temporizador con alertas visuales (cambio a color rojo, efecto de pulso) y finalización automática de la prueba.
    *   **Bloqueo de Navegación:** El sidebar se bloquea durante la prueba para evitar salidas accidentales.
    *   **Renderizado de Preguntas:** Componente `SimulationQuestion` capaz de mostrar preguntas con/sin imagen y opciones de respuesta con/sin imagen.
    *   **Seguimiento de Respuestas:** Las respuestas del usuario se almacenan temporalmente en el estado del componente, listas para ser enviadas.
*   **Página de Resultados (`SimulationResultsPage`):**
    *   Muestra el puntaje final en la escala de **0 a 300** y el tiempo empleado.
    *   Presenta una retroalimentación general (espacio listo para la IA).
    *   Incluye un **medidor de desempeño visual** que ubica el puntaje en una escala de niveles (Nivel 1 a 4) con íconos y colores.
    *   Muestra una revisión detallada de cada pregunta, indicando la respuesta del usuario y la correcta.
*   **Historial de Calificaciones (`CalificacionesPage`):**
    *   Muestra el puntaje promedio y un historial de todos los intentos.
    *   El botón "Detalles" es funcional y reutiliza la `SimulationResultsPage` para mostrar los resultados de intentos pasados.

---

## 🔗 Conexión con el Backend

El frontend ha sido diseñado bajo la filosofía **"API-first"**, lo que significa que está perfectamente preparado para la integración con el backend.

*   **Contratos de Datos:** Los datos de ejemplo (`mock data`) utilizados en todo el proyecto (ej. `calificacionesData`, `mockQuestions`) sirven como un "contrato" claro. El backend sabe exactamente qué estructura de JSON debe devolver cada endpoint de la API.
*   **Ubicación de Llamadas a la API:** La lógica para obtener datos está encapsulada en hooks `useEffect` en cada página. El trabajo del backend consiste en reemplazar los datos de ejemplo con llamadas `axios` a los endpoints correspondientes.
*   **Flujos Definidos:** Los flujos de usuario (CRUD, finalizar un simulacro, etc.) definen claramente los endpoints necesarios (ej. `GET /api/users`, `POST /api/simulations/submit`).

Este README debe servir como una guía completa para el estado actual del proyecto. ¡Excelente trabajo a todos!