// src/pages/student/CalificacionesPage.jsx

import React from 'react';
import Card from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Calendar } from 'lucide-react';

// --- DATOS DE EJEMPLO COMPLETOS (COMO LOS TENÍAMOS) ---
const calificacionesData = {
  averageScore: 182,
  attempts: [
    { 
      id: 'attempt-1', examName: 'Simulacro General', score: 188.0, level: 'Nivel 3', time: '2h 15m', date: '10/05/2024',
      // Datos detallados para la página de resultados
      results: { 
        examName: 'Simulacro General',
        generalFeedback: "Tu desempeño en el simulacro general fue sobresaliente, especialmente en Lectura Crítica. El área principal a reforzar es Comunicación Escrita.",
        timeTaken: "2h 15m",
        finalScore: 188.0,
        level: 'Nivel 3',
        questions: [
          { question_id: 'q1', statement: 'Pregunta 1 del simulacro general...', user_answer: { selectedOption: 'o1c', optionText: 'C) Opción C' }, correct_answer: { optionId: 'o1c', optionText: 'C) Opción C' } },
          { question_id: 'q2', statement: 'Pregunta 2 del simulacro general...', user_answer: { selectedOption: 'o2a', optionText: 'A) Opción A' }, correct_answer: { optionId: 'o2b', optionText: 'B) Opción B' } },
        ]
      }
    },
    { 
      id: 'attempt-2', examName: 'Lectura Crítica', score: 215.5, level: 'Nivel 4', time: '25m', date: '08/05/2024',
      results: {
        examName: 'Lectura Crítica',
        generalFeedback: "Excelente desempeño en Lectura Crítica. Demuestras una gran capacidad para la inferencia y evaluación de textos.",
        timeTaken: "25m",
        finalScore: 215.5,
        level: 'Nivel 4',
        questions: [
           { question_id: 'lc-q1', statement: '¿Cuál es la capital de Francia?', user_answer: { selectedOption: 'lc-o1c', optionText: 'C) París' }, correct_answer: { optionId: 'lc-o1c', optionText: 'C) París' } },
           { question_id: 'lc-q2', statement: '¿Qué se puede inferir del texto?', user_answer: { selectedOption: 'lc-o2b', optionText: 'B) Opción B' }, correct_answer: { optionId: 'lc-o2b', optionText: 'B) Opción B' } },
        ]
      }
    },
  ],
};

// Componente para la insignia del Nivel
const NivelBadge = ({ level }) => {
  const levelColors = {
    'Nivel 1': 'bg-red-100 text-red-800',
    'Nivel 2': 'bg-yellow-100 text-yellow-800',
    'Nivel 3': 'bg-blue-100 text-blue-800',
    'Nivel 4': 'bg-green-100 text-green-800',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${levelColors[level] || 'bg-gray-100 text-gray-800'}`}>{level}</span>;
};

const CalificacionesPage = () => {
  const navigate = useNavigate();

  const navigateToDetails = (attempt) => {
    if (attempt.results) {
      navigate(`/student/resultados/${attempt.id}`, { 
        state: { 
          results: attempt.results,
          from: '/student/calificaciones' 
        } 
      });
    } else {
      alert("No se encontraron los detalles para esta prueba.");
    }
  };

  return (
    <div className="space-y-8">
      {/* --- SECCIÓN SUPERIOR RESTAURADA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="flex flex-col items-center justify-center text-center h-full bg-slate-50 border-slate-200">
            <p className="text-6xl font-bold text-slate-800">{Math.round(calificacionesData.averageScore)}</p>
            <h3 className="text-slate-600 font-semibold mt-2 tracking-wide uppercase text-sm">Puntaje Global Promedio</h3>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Progreso General</h2>
            <div className="h-48 bg-gray-100 flex items-center justify-center rounded-lg">
              <p className="text-gray-400">Gráfico de puntajes en construcción</p>
            </div>
          </Card>
        </div>
      </div>

      {/* --- TABLA DE HISTORIAL RESTAURADA --- */}
      <Card className="overflow-hidden p-0">
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4 font-semibold uppercase text-sm">Examen</th>
                <th className="p-4 font-semibold uppercase text-sm">Puntaje</th>
                <th className="p-4 font-semibold uppercase text-sm">Nivel</th>
                <th className="p-4 font-semibold uppercase text-sm">Fecha</th>
                <th className="p-4 font-semibold uppercase text-sm text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {calificacionesData.attempts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-gray-800">{item.examName}</td>
                  <td className="p-4 font-bold text-gray-700">{item.score.toFixed(0)}</td>
                  <td className="p-4"><NivelBadge level={item.level} /></td>
                  <td className="p-4 text-gray-600">{item.date}</td>
                  <td className="p-4 text-center">
                    <Button onClick={() => navigateToDetails(item)} variant="primary" className="bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-lg">Detalles</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- VISTA MÓVIL RESTAURADA --- */}
        <div className="md:hidden">
          <div className="bg-slate-100 text-slate-600 p-4 font-semibold rounded-t-xl uppercase text-sm tracking-wider">Historial de Pruebas</div>
          <div className="divide-y divide-gray-200">
            {calificacionesData.attempts.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-lg text-gray-800">{item.examName}</p>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-slate-700">{item.score.toFixed(0)}</p>
                    <NivelBadge level={item.level} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2"><Calendar size={14} /> {item.date}</p>
                <div className="pt-2">
                  <Button onClick={() => navigateToDetails(item)} variant="primary" className="w-full bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 rounded-lg">Ver Detalles</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CalificacionesPage;