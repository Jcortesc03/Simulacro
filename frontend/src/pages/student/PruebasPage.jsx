import React, { useState,useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart2, Users, Globe, PenSquare, Award, ChevronRight, Clock, Target, BookCheck } from 'lucide-react';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const pruebas = [
  {
    id: 'a1d9d539-7e2a-4541-a88d-8fabd6607546',
    name: 'Lectura Crítica',
    description: 'Evalúa la capacidad para comprender, interpretar y evaluar textos de manera crítica y reflexiva.',
    icon: <BookOpen />,
    colorClasses: 'from-blue-600 to-blue-700',
    bgClasses: 'bg-blue-50 border-blue-200',
    textClasses: 'text-blue-800'
  },
  {
    id: 'a0359b39-a3df-4bb3-a1c4-4befcbbc8a1f',
    name: 'Razonamiento Cuantitativo',
    description: 'Mide las habilidades matemáticas aplicadas a la resolución de problemas en contextos diversos.',
    icon: <BarChart2 />,
    colorClasses: 'from-emerald-600 to-emerald-700',
    bgClasses: 'bg-emerald-50 border-emerald-200',
    textClasses: 'text-emerald-800'
  },
  {
    id: 'f869d2ae-37f2-4c80-ab60-2313eaf8a8b2',
    name: 'Competencias Ciudadanas',
    description: 'Evalúa conocimientos y habilidades para el ejercicio de la ciudadanía responsable.',
    icon: <Users />,
    colorClasses: 'from-purple-600 to-purple-700',
    bgClasses: 'bg-purple-50 border-purple-200',
    textClasses: 'text-purple-800'
  },
  {
    id: '2939efbb-a07a-409c-a50d-a68404f9ce28',
    name: 'Inglés',
    description: 'Determina el nivel de competencia comunicativa en lengua inglesa en contextos académicos.',
    icon: <Globe />,
    colorClasses: 'from-red-600 to-red-700',
    bgClasses: 'bg-red-50 border-red-200',
    textClasses: 'text-red-800'
  },
  {
    id: 'd7783d93-703a-4adb-af63-20dbe3adcf12',
    name: 'Escritura',
    description: 'Evalúa la capacidad para comunicar ideas de forma clara, coherente y argumentada por escrito.',
    icon: <PenSquare />,
    colorClasses: 'from-amber-600 to-amber-700',
    bgClasses: 'bg-amber-50 border-amber-200',
    textClasses: 'text-amber-800',
    isEssay: true
  },
];

const PruebaCard = ({ prueba, onStart }) => {
  return (
    <div className="group relative">
      <div
        onClick={() => onStart(prueba)}
        className="bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-gray-300 overflow-hidden"
      >
        <div className={`h-2 bg-gradient-to-r ${prueba.colorClasses}`}></div>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className={`p-3 rounded-lg ${prueba.bgClasses} border mr-4`}>
                  {React.cloneElement(prueba.icon, { size: 24, className: prueba.textClasses })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{prueba.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>Práctica personalizable</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">{prueba.description}</p>
              <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
                {prueba.isEssay ? (
                  <>
                  <div className="flex items-center"><Target size={12} className="mr-1" /><span>1 pregunta de ensayo</span></div>
                  <div className="flex items-center"><BookCheck size={12} className="mr-1" /><span>Calificación con IA</span></div>
                  </>
                ) : (
                  <>
                  <div className="flex items-center"><Target size={12} className="mr-1" /><span>5-20 preguntas</span></div>
                  <div className="flex items-center"><BookCheck size={12} className="mr-1" /><span>Retroalimentación IA</span></div>
                  </>
                )}
              </div>
            </div>
            <div className="ml-4 self-center">
              <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneralSimulationCard = ({ onStart }) => {
  const generalSimData = { id: 'general', name: 'Simulacro Integral' };
  return (
    <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl shadow-xl overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/></pattern></defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      <div onClick={() => onStart(generalSimData)} className="relative p-8 cursor-pointer transition-all duration-300 hover:bg-slate-700/50">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg"><Award size={32} className="text-white" /></div>
          <h2 className="text-3xl font-bold text-white mb-2">Simulacro Integral</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">Evaluación completa que integra todas las competencias académicas en una experiencia similar al examen oficial. Ideal para medir tu preparación integral.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-slate-600/30 rounded-lg backdrop-blur-sm"><div className="text-blue-400 mb-2"><BookOpen size={24} className="mx-auto" /></div><h4 className="text-white font-semibold text-sm">Todas las Áreas</h4><p className="text-slate-300 text-xs mt-1">5 competencias evaluadas</p></div>
          <div className="text-center p-4 bg-slate-600/30 rounded-lg backdrop-blur-sm"><div className="text-blue-400 mb-2"><Clock size={24} className="mx-auto" /></div><h4 className="text-white font-semibold text-sm">Tiempo Real</h4><p className="text-slate-300 text-xs mt-1">Cronometro oficial</p></div>
          <div className="text-center p-4 bg-slate-600/30 rounded-lg backdrop-blur-sm"><div className="text-blue-400 mb-2"><Target size={24} className="mx-auto" /></div><h4 className="text-white font-semibold text-sm">Análisis IA</h4><p className="text-slate-300 text-xs mt-1">Retroalimentación detallada</p></div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"><Award size={18} className="mr-2" /> Iniciar Simulacro Integral</div>
          <p className="text-slate-400 text-xs mt-3">Evaluación completa • Tiempo estimado: 2.5 horas</p>
        </div>
      </div>
    </div>
  );
};

const ConfigurationModal = ({ show, onClose, onConfirm, prueba, questionCount, setQuestionCount }) => {
  const isGeneralSimulacro = prueba?.id === 'general';
  const isEssayTest = prueba?.isEssay === true;
  const questionCountOptions = [5, 10, 15, 20];

  return (
    <ConfirmationModal
      show={show}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Configurar Evaluación`}
      message={ isEssayTest ? 'Esta prueba consta de una única pregunta donde deberás redactar un ensayo. Tendrás 40 minutos para completarla.' : isGeneralSimulacro ? 'Esta evaluación integral incluye preguntas de las cinco competencias académicas fundamentales, proporcionando una experiencia completa de preparación.' : 'Configure los parámetros de su sesión de práctica. Puede realizar múltiples intentos para fortalecer sus competencias.'}
      variant="primary"
      confirmText="Iniciar Evaluación"
      cancelText="Cancelar"
    >
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center">
          {prueba && !isGeneralSimulacro && (<div className={`p-2 rounded-lg ${pruebas.find(p => p.id === prueba.id)?.bgClasses} border mr-3`}>{React.cloneElement(pruebas.find(p => p.id === prueba.id)?.icon || <BookOpen />, { size: 20, className: pruebas.find(p => p.id === prueba.id)?.textClasses })}</div>)}
          {isGeneralSimulacro && (<div className="p-2 rounded-lg bg-slate-100 border border-slate-200 mr-3"><Award size={20} className="text-slate-700" /></div>)}
          <div>
            <h3 className="font-semibold text-gray-900">{prueba?.name}</h3>
            <p className="text-sm text-gray-600">{isGeneralSimulacro ? 'Evaluación integral de competencias' : 'Práctica específica de competencia'}</p>
          </div>
        </div>
      </div>
      {!isGeneralSimulacro && !isEssayTest && (
        <div className="mb-4">
          <label htmlFor="questionCount" className="block text-sm font-semibold text-gray-700 mb-3">Configuración de la Sesión:</label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Cantidad de preguntas a resolver</label>
              <div className="relative">
                <select id="questionCount" name="questionCount" value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value))} className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                  {questionCountOptions.map((count) => (<option key={count} value={count}>{count} preguntas</option>))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"><ChevronRight size={16} className="rotate-90" /></div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="text-blue-600 mr-2 mt-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <div>
                  <p className="text-blue-800 text-xs font-medium">Información de la práctica</p>
                  {isEssayTest ? (<p className="text-blue-700 text-xs mt-1">• Tiempo fijo: 90 minutos<br/>• Calificación y retroalimentación con IA<br/>• Evalúa tu capacidad argumentativa</p>) : isGeneralSimulacro ? (<p className="text-blue-700 text-xs mt-1">• Preguntas fijas: 41 (incluye ensayo)<br/>• Tiempo estimado: 1 hora y 40 minutos<br/>• Cubre todas las competencias evaluadas</p>) : (<p className="text-blue-700 text-xs mt-1">• Tiempo estimado: {questionCount * 1.5} minutos<br/>• Retroalimentación personalizada con IA<br/>• Análisis detallado de respuestas</p>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmationModal>
  );
};

const PruebasPage = () => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({ isOpen: false, prueba: null, questionCount: 10 });
  const [showScrollButton, setShowScrollButton] = useState(false);
  const generalSimulacroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!generalSimulacroRef.current) return;
      const topOfGeneralSim = generalSimulacroRef.current.getBoundingClientRect().top;
      const scrollPosition = window.scrollY;
      const isVisible = scrollPosition > 150 && topOfGeneralSim > window.innerHeight * 0.8;
      setShowScrollButton(isVisible);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollClick = () => {
    generalSimulacroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleStartAttempt = (prueba) => {
    setModalState({ isOpen: true, prueba: prueba, questionCount: 10 });
  };

  const handleConfirmStart = () => {
    if (!modalState.prueba) return;
    const { id, name, isEssay } = modalState.prueba;
    const questionCount = modalState.questionCount;
    setModalState({ isOpen: false, prueba: null, questionCount: 10 });

    if (isEssay) {
      navigate('/student/essay-test', { state: { examName: name, simulationId: id } });
    } else if (id === 'general') {
      navigate(`/student/simulacro-general`, { state: { examName: name, questionCount: 41 } });
    } else {
      navigate(`/student/simulacro/${id}`, { state: { examName: name, questionCount: questionCount } });
    }
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, prueba: null, questionCount: 10 });
  };

  const handleSetQuestionCount = (count) => {
    setModalState(prev => ({ ...prev, questionCount: count }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Centro de Evaluación Académica</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-6"></div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Prácticas por Competencia</h2>
          <p className="text-gray-500 mt-2">Fortalece tus habilidades en áreas específicas.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pruebas.map((prueba) => (
            <PruebaCard key={prueba.id} prueba={prueba} onStart={handleStartAttempt} />
          ))}
        </div>
        <div>
          <div ref={generalSimulacroRef}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Simulacro General</h2>
              <p className="text-gray-500 mt-2">Pon a prueba todos tus conocimientos en una simulación integral.</p>
            </div>
            <GeneralSimulationCard onStart={handleStartAttempt} />
          </div>
        </div>
        <ConfigurationModal
          show={modalState.isOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmStart}
          prueba={modalState.prueba}
          questionCount={modalState.questionCount}
          setQuestionCount={handleSetQuestionCount}
        />
      </div>
      <ScrollToGeneralButton isVisible={showScrollButton} onClick={handleScrollClick} />
    </div>
  );
};

const ScrollToGeneralButton = ({ isVisible, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-30 flex items-center gap-3 px-4 py-3 bg-white rounded-full shadow-2xl border-2 border-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <span className="font-bold text-gray-800">Ver Simulacro General</span>
      <div className="p-1 bg-blue-600 rounded-full text-white"><ChevronRight size={20} className="transform rotate-90" /></div>
    </button>
  );
};

export default PruebasPage;