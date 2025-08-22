# Resumen de la Aplicación Frontend

¡Bienvenido a la aplicación frontend! Este documento proporciona una guía para nuevos desarrolladores para entender la estructura del proyecto, sus funcionalidades principales y cómo empezar.

## 1. Resumen del Proyecto

Esta es una aplicación de una sola página (SPA) basada en React, construida con Vite. Sirve como la interfaz de usuario para la plataforma de simulación, proporcionando diferentes paneles y funcionalidades para los roles de administrador, estudiante y profesor.

## 2. Pila Tecnológica

*   **React**: Una librería de JavaScript para construir interfaces de usuario.
*   **React Router DOM**: Para el enrutamiento declarativo dentro de la aplicación.
*   **Tailwind CSS**: Un framework CSS de utilidad para el estilizado.
*   **Vite**: Una herramienta de construcción rápida que proporciona una experiencia de desarrollo ultrarrápida.
*   **i18next**: Un framework de internacionalización para manejar múltiples idiomas.
*   **Axios**: Un cliente HTTP basado en promesas para realizar solicitudes a la API.

## 3. Estructura del Proyecto

Aquí hay una visión general de los directorios clave y sus propósitos:

*   `public/`: Contiene activos estáticos como imágenes y `locales` para la internacionalización.
    *   `public/locales/`: Almacena archivos JSON de traducción (`en/translation.json`, `es/translation.json`).
*   `src/`: El directorio principal del código fuente.
    *   `src/App.jsx`: El componente raíz que ahora principalmente renderiza las rutas de la aplicación.
    *   `src/main.jsx`: El punto de entrada de la aplicación React.
    *   `src/index.css`: Estilos CSS globales, principalmente importaciones de Tailwind CSS.
    *   `src/api/`: Contiene módulos para la comunicación con la API.
        *   `src/api/axiosInstance.jsx`: Configura la instancia de Axios para las solicitudes a la API.
    *   `src/assets/`: Para activos específicos de la aplicación como logotipos o iconos.
    *   `src/components/`: Componentes de UI reutilizables.
        *   `src/components/dashboard/`: Componentes específicos de las vistas del panel.
        *   `src/components/layout/`: Componentes de diseño (por ejemplo, `AdminLayout`, `Sidebar`).
        *   `src/components/questions/`: Componentes relacionados con la visualización y formularios de preguntas.
        *   `src/components/simulation/`: Componentes utilizados dentro del proceso de simulación.
        *   `src/components/ui/`: Elementos de UI genéricos y altamente reutilizables (por ejemplo, `Button`, `Modal`).
    *   `src/context/`: Proveedores de la API de Contexto de React para la gestión del estado global.
        *   `src/context/SimulationContext.jsx`: Gestiona el estado relacionado con el proceso de simulación.
    *   `src/data/`: Datos estáticos utilizados dentro de la aplicación (por ejemplo, `categoriesData.js`).
    *   `src/pages/`: Componentes de nivel superior que representan diferentes vistas o páginas de la aplicación. Organizados por rol (administrador, estudiante, profesor) y funcionalidad (autenticación).
    *   `src/routes/`: **Crucial para el enrutamiento.** Contiene el archivo `AppRoutes.jsx` donde se definen todas las rutas de la aplicación.
    *   `src/i18n.js`: Configuración para `i18next` para la internacionalización.

## 4. Flujo de Enrutamiento

La aplicación utiliza `react-router-dom` para la navegación.

*   **`src/routes/AppRoutes.jsx`**: Este es el lugar central donde se definen todas las rutas de la aplicación. Utiliza los componentes `BrowserRouter`, `Routes` y `Route` para mapear URLs a componentes de página y diseños específicos. Las rutas se agrupan por funcionalidad y rol de usuario (por ejemplo, `/admin`, `/student`, `/teacher`, `/auth`).
*   **`src/App.jsx`**: El componente principal `App` ahora simplemente importa y renderiza el componente `AppRoutes`, manteniendo `App.jsx` limpio y enfocado en el arranque del sistema de enrutamiento.

Esta separación facilita la gestión y comprensión de la estructura de navegación de la aplicación.

## 5. Integración de la API

Todas las solicitudes a la API se manejan a través de `src/api/axiosInstance.jsx`. Este archivo configura una instancia de Axios preconfigurada, que puede incluir URLs base, encabezados (como tokens de autorización) e interceptores para el manejo de errores o la modificación de solicitudes.

Al realizar llamadas a la API desde componentes o servicios, debe importar y usar esta instancia de Axios configurada.

## 6. Gestión del Estado

La aplicación utiliza principalmente la API de Contexto de React para la gestión del estado global.

*   **`src/context/SimulationContext.jsx`**: Este contexto proporciona estado y funciones relacionadas con el proceso de simulación, como la pregunta actual, el temporizador y los resultados. Los componentes envueltos dentro del `SimulationProvider` pueden acceder a este estado compartido.

Para el estado local de los componentes, se utilizan los hooks `useState` y `useReducer` de React.

## 7. Estilizado

Tailwind CSS se utiliza para el estilizado. Esto significa que la mayor parte del estilizado se aplica directamente en el JSX utilizando clases de utilidad. Los estilos personalizados o los componentes que requieren un CSS más complejo se pueden encontrar en `src/index.css` o dentro de módulos CSS específicos de componentes si se introducen.

## 8. Internacionalización (i18n)

La aplicación soporta múltiples idiomas utilizando `i18next`.

*   **`src/i18n.js`**: Este archivo contiene la configuración para `i18next`, incluyendo la detección de idioma, idiomas de respaldo y carga de recursos.
*   **`public/locales/{lang}/translation.json`**: Las cadenas de traducción se almacenan en archivos JSON, separadas por idioma.
*   **Uso**: Puede usar el hook `useTranslation` de `react-i18next` en sus componentes para acceder a las cadenas traducidas.

## 9. Cómo Empezar

Para configurar y ejecutar el proyecto localmente:

1.  **Clonar el repositorio**:
    ```bash
    git clone <url-del-repositorio>
    cd frontend
    ```
2.  **Instalar dependencias**:
    El proyecto utiliza `bun` como gestor de paquetes. Si no tiene `bun` instalado, puede instalarlo desde [bun.sh](https://bun.sh/).
    ```bash
    bun install
    ```
    Alternativamente, si prefiere `npm` o `yarn`:
    ```bash
    npm install # o yarn install
    ```
3.  **Ejecutar el servidor de desarrollo**:
    ```bash
    bun dev
    ```
    Esto iniciará el servidor de desarrollo de Vite, normalmente en `http://localhost:5173`.

## 10. Notas de Refactorización

Al refactorizar, tenga en cuenta lo siguiente:

*   **Modularidad**: Busque componentes pequeños, enfocados y reutilizables.
*   **Consistencia**: Mantenga el estilo de codificación, las convenciones de nomenclatura y los patrones arquitectónicos existentes.
*   **Rendimiento**: Tenga en cuenta el rendimiento de renderizado, especialmente en listas y UIs complejas.
*   **Capacidad de prueba**: Escriba código que sea fácil de probar. Considere agregar pruebas unitarias o de integración para funcionalidades críticas.
*   **Accesibilidad**: Asegúrese de que los cambios en la UI sean accesibles.
*   **Documentación**: Actualice este `README.md` o agregue comentarios en línea para la lógica compleja según sea necesario.

¡No dude en explorar el código base. Si tiene alguna pregunta, no dude en preguntar!