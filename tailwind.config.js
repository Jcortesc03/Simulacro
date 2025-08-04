// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esta línea es crucial
  ],
  
  theme: {
    extend: {
      keyframes: {
        'fade-in': { // Nueva animación
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        }
      },
        animation: {
          'fade-in': 'fade-in 0.3s ease-out forwards', 
          'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
          'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
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