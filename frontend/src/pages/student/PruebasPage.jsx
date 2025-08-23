// src/pages/student/PruebasPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart2, Users, Globe, PenSquare, Award, ChevronRight } from 'lucide-react';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

// Asegúrate de que los IDs aquí sean los que quieres usar en la URL
const pruebas = [
  { id: 'lectura-critica', name: 'Lectura Crítica', description: 'Comprende, interpreta y evalúa textos complejos.', icon: <BookOpen />, colorClasses: 'bg-blue-100 text-blue-800' },
  { id: 'razonamiento-cuantitativo', name: 'Razonamiento Cuantitativo', description: 'Aplica conceptos matemáticos para solucionar problemas.', icon: <BarChart2 />, colorClasses: 'bg-green-100 text-green-800' },
  { id: 'competencias-ciudadanas', name: 'Competencias Ciudadanas', description: 'Analiza situaciones sociales desde una perspectiva cívica.', icon: <Users />, colorClasses: 'bg-purple-100 text-purple-800' },
  { id: 'ingles', name: 'Inglés', description: 'Mide tu nivel de comprensión y uso del idioma inglés.', icon: <Globe />, colorClasses: 'bg-red-100 text-red-800' },
  { id: 'comunicacion-escrita', name: 'Comunicación Escrita', description: 'Produce textos argumentativos coherentes y bien estructurados.', icon: <PenSquare />, colorClasses: 'bg-yellow-100 text-yellow-800' },
];

const PruebaCard = ({ prueba, onStart }) => {
  return (
    <div
      onClick={() => onStart(prueba)}
      className="flex items-center bg-white p-4 rounded-xl shadow-md border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-1"
    >
      <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${prueba.colorClasses}`}>{React.cloneElement(prueba.icon, { size: 32 })}</div>
      <div className="flex-grow ml-5">
        <h3 className="text-xl font-bold text-gray-900">{prueba.name}</h3>
        <p className="text-gray-500 mt-1">{prueba.description}</p>
      </div>
      <div className="flex-shrink-0 ml-5"><ChevronRight size={28} className="text-gray-400" /></div>
    </div>
  );
};

const GeneralSimulationCard = ({ onStart }) => {
  const generalSimData = { id: 'general', name: 'Simulacro General' };
  return (
    <div onClick={() => onStart(generalSimData)} className="p-8 rounded-xl shadow-2xl bg-gray-800 text-white text-center cursor-pointer transition-all duration-300 hover:shadow-fuchsia-400/30 hover:bg-gray-900 hover:-translate-y-1">
      <Award size={48} className="mx-auto mb-4 text-fuchsia-400" />
      <h3 className="text-3xl font-extrabold mb-2">Simulacro General</h3>
      <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Pon a prueba todas tus competencias en una simulación completa y cronometrada del examen real.</p>
      <span className="inline-block bg-fuchsia-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-fuchsia-600 transition-colors">
        ¡Comenzar Reto Final!
      </span>
    </div>
  );
};

const PruebasPage = () => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({ isOpen: false, prueba: null, questionCount: 10 });
  const questionCountOptions = [5, 10, 15, 20];

  const handleStartAttempt = (prueba) => {
    setModalState({ isOpen: true, prueba: prueba, questionCount: 10 });
  };

  const handleConfirmStart = () => {
    if (!modalState.prueba) return;
    const { id, name } = modalState.prueba;
    const questionCount = modalState.questionCount;

    console.log(`Navegando a /student/simulacro/${id} con ${questionCount} preguntas.`);

    setModalState({ isOpen: false, prueba: null, questionCount: 10 });

    // La lógica de navegación
    navigate(`/student/simulacro/${id}`, {
      state: {
        examName: name,
        questionCount: questionCount
      }
    });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, prueba: null, questionCount: 10 });
  };

  const isGeneralSimulacro = modalState.prueba?.id === 'general';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Selecciona una Prueba para Iniciar</h1>

      <div className="space-y-6 mb-12">
        {pruebas.map(p => (
          <PruebaCard key={p.id} prueba={p} onStart={handleStartAttempt} />
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Prueba Definitiva</h2>
      <GeneralSimulationCard onStart={handleStartAttempt} />

      <ConfirmationModal
        show={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStart}
        title={`Iniciar Prueba: ${modalState.prueba?.name}`}
        message={
          isGeneralSimulacro
            ? "Esta prueba reúne preguntas de las 5 competencias para una experiencia completa. ¡Mucha suerte!"
            : "Selecciona el número de preguntas y prepárate para fortalecer tus habilidades. Puedes realizar todos los intentos que desees."
        }
        variant="primary"
        confirmText="Iniciar"
        cancelText="Volver"
      >
        {!isGeneralSimulacro && (
          <div className="text-left">
            <label htmlFor="questionCount" className="block text-md font-semibold text-gray-700 mb-2">
              Cantidad de preguntas a resolver:
            </label>
            <div className="relative">
              <select
                id="questionCount"
                name="questionCount"
                value={modalState.questionCount}
                onChange={(e) => setModalState(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                className="appearance-none w-full bg-gray-100 border-2 border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              >
                {questionCountOptions.map(count => (
                  <option key={count} value={count}>{count} preguntas</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
};

export default PruebasPage;
