import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18nextHttpBackend from 'i18next-http-backend'; // Permite cargar archivos desde /public

i18n
  // Carga las traducciones desde la carpeta /public/locales
  .use(i18nextHttpBackend) 
  // Pasa la instancia de i18n a react-i18next.
  .use(initReactI18next)
  // Configuración inicial
  .init({
    fallbackLng: 'es', // Idioma por defecto si el del navegador no está disponible
    lng: 'es', // Idioma inicial
    debug: true, // Muestra logs en la consola, útil para depurar. Desactívalo en producción.
    interpolation: {
      escapeValue: false, // React ya se encarga de escapar los valores (previene XSS)
    },
    backend: {
      // Ruta a tus archivos de traducción
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;