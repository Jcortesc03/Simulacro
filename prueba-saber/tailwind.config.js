// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esta línea es crucial
  ],
  
  theme: {
    extend: {
      colors: {
        // Paleta para el Sidebar
        'sidebar-bg': '#0D47A1',
        'sidebar-item': '#1565C0',
        'sidebar-item-hover': '#1976D2',
        
        // Colores de la marca para botones
        'brand-blue': '#2563EB',
        'brand-red': '#DC2626',
        'light-gray': '#F3F4F6',
        'success': '#16A34A',
      },
    },
  },
  plugins: [],
}