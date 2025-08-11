import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import QuestionCard from '../../../components/questions/QuestionCard';
import QuestionForm from '../../../components/questions/QuestionFormPage';
import Modal from '../../../components/ui/Modal';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import SuccessModal from '../../../components/ui/SuccessModal';

// --- CAMBIO REALIZADO: Importamos el componente de notificación directamente ---
import Notification from '../../../components/ui/Notification'; // Asegúrate de que la ruta sea correcta

// --- SIMULACIÓN DE BASE DE DATOS (SIN CAMBIOS) ---
const allData = {
  'lectura-critica': {
    title: 'Lectura Crítica',
    subcategories: ['Literal', 'Inferencial', 'Analítica'],
    questions: [
      { id: 1, subcategory: 'Literal', pregunta: "Pregunta Literal de Lectura Crítica 1...", opciones: [{ texto: "A)", esCorrecta: true }], dificultad: "Fácil", editadoPor: "Admin" },
      { id: 4, subcategory: 'Inferencial', pregunta: "Pregunta Inferencial de Lectura Crítica 1...", opciones: [{ texto: "A)", esCorrecta: true }], dificultad: "Media", editadoPor: "Admin" }
    ]
  },
 'razonamiento-cuantitativo': {
    title: 'Razonamiento Cuantitativo',
    subcategories: ['Estadística', 'Geometría', 'Álgebra y cálculo'],
    questions: [
      { id: 201, subcategory: 'Estadística',
        pregunta: "En una clase de 30 estudiantes, el 60% son mujeres. Si el 25% de las mujeres y el 50% de los hombres tienen ojos azules, ¿cuántos estudiantes en total NO tienen ojos azules?",
        opciones: [
          { texto: "A) 10.5", esCorrecta: false },
          { texto: "B) 19.5", esCorrecta: false},
          { texto: "C) 18", esCorrecta: false },
          { texto: "D) 20", esCorrecta: true } ]
      },
     { 
        id: 202, 
        subcategory: 'Álgebra y cálculo', 
        pregunta: "Un coche viaja a una velocidad constante de 80 km/h. ¿Cuántos kilómetros recorrerá en 45 minutos?",
        opciones: [
          { texto: "A) 45 km", esCorrecta: false },
          { texto: "B) 80 km", esCorrecta: false },
          { texto: "C) 60 km", esCorrecta: true },
          { texto: "D) 75 km", esCorrecta: false }
        ],
        dificultad: "Fácil", 
        editadoPor: "Profesor" 
      }
    ]
  },  
  'competencias-ciudadanas': {
    title: 'Competencias Ciudadanas',
    subcategories: ['Pensamiento social', 'Argumentación', 'Multiperspectivismo', 'Pensamiento sistémico'],
    questions: [
      { 
        id: 301, 
        subcategory: 'Multiperspectivismo', 
        pregunta: "Un proyecto de ley busca prohibir el uso de plásticos de un solo uso para proteger el medio ambiente. Un empresario argumenta que esta ley causará el cierre de su fábrica y la pérdida de empleos. ¿Qué conflicto de intereses se evidencia principalmente en esta situación?",
        opciones: [
          { texto: "A) Un conflicto entre diferentes partidos políticos.", esCorrecta: false },
          { texto: "B) Un conflicto entre la protección ambiental y el desarrollo económico.", esCorrecta: true },
          { texto: "C) Un conflicto entre el gobierno nacional y los gobiernos locales.", esCorrecta: false },
          { texto: "D) Un conflicto entre consumidores y productores.", esCorrecta: false }
        ],
        dificultad: "Fácil", 
        editadoPor: "Admin" 
      }
    ]
  },
   'comunicacion-escrita': {
    title: 'Comunicación Escrita',
    subcategories: ['Forma de expresión', 'Planteamiento defendido', 'Organización del texto'],
    questions: [
        { 
          id: 401, 
          subcategory: 'Organización del texto', 
          pregunta: "Se te pide escribir un ensayo argumentativo. ¿Cuál de las siguientes estructuras sería la más adecuada para organizar tus ideas de manera lógica y persuasiva?",
          opciones: [
            { texto: "A) Conclusión, desarrollo de argumentos y finalmente la introducción.", esCorrecta: false },
            { texto: "B) Desarrollo de argumentos sin una tesis clara.", esCorrecta: false },
            { texto: "C) Narrar una historia personal sin conectar con el tema principal.", esCorrecta: false },
            { texto: "D) Introducción con tesis, desarrollo con argumentos y evidencia, y conclusión.", esCorrecta: true }
          ],
          dificultad: "Fácil", 
          editadoPor: "Profesor" 
        }
    ]
  },
   'ingles': {
    title: 'Inglés',
    subcategories: ['Comprensión auditiva (Listening)', 'Comprensión de lectura (Reading)', 'Expresión escrita (Writing)', 'Expresión oral (Speaking)'],
    questions: [
      { 
        id: 501, 
        subcategory: 'Comprensión de lectura (Reading)', 
        pregunta: "Read the sentence: 'Despite the heavy rain, the team decided to play the match.' What can be understood from this sentence?",
        opciones: [
          { texto: "A) The match was cancelled because of the rain.", esCorrecta: false },
          { texto: "B) The team played because it was raining.", esCorrecta: false },
          { texto: "C) The team played even though it was raining.", esCorrecta: true },
          { texto: "D) The team preferred to play in the rain.", esCorrecta: false }
        ],
        dificultad: "Media", 
        editadoPor: "Admin" 
      }
    ]
  }
};
// --- FIN SIMULACIÓN ---

export default function CategoryDetailPage() {
  const { categoryPath } = useParams();

  // Estados para manejar los datos
  const [questions, setQuestions] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para la interactividad
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [modal, setModal] = useState({ type: null, isOpen: false, id: null });

  // --- CAMBIO REALIZADO: Estado local para la notificación ---
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  // Efecto para cargar los datos de la categoría actual
  useEffect(() => {
    setIsLoading(true);
    const categoryData = allData[categoryPath];
    if (categoryData) {
      setQuestions(categoryData.questions || []);
      setSubcategories(categoryData.subcategories || []);
      setSelectedSubcategory('all');
    } else {
      setQuestions([]);
      setSubcategories([]);
    }
    setTimeout(() => setIsLoading(false), 300);
  }, [categoryPath]);

  const filteredQuestions = useMemo(() => {
    if (selectedSubcategory === 'all') return questions;
    return questions.filter(q => q.subcategory === selectedSubcategory);
  }, [questions, selectedSubcategory]);

  const openAddModal = () => {
    setEditingQuestion(null);
    setIsFormModalOpen(true);
  };
  
  const openEditModal = (question) => {
    setEditingQuestion(question);
    setIsFormModalOpen(true);
  };

  const handleSaveQuestion = (formData) => {
    // --- CAMBIO REALIZADO: Usamos el estado local para mostrar la notificación ---
    const isEditing = Boolean(editingQuestion);
    if (isEditing) {
      setNotification({ message: 'editado correctamente' });
    } else {
      setNotification({ message: 'agregado correctamente' });
    }
    // --- FIN DEL CAMBIO ---

    console.log("Guardando pregunta (simulación):", formData);
    // Tu lógica para guardar los datos...
    setIsFormModalOpen(false);
  };

  const handleDeleteClick = (questionId) => setModal({ type: 'deleteConfirm', isOpen: true, id: questionId });
  
  const handleConfirmDelete = () => {
    console.log("Eliminando pregunta (simulación):", modal.id);
    setModal({ type: 'deleteSuccess', isOpen: true });
  };
  
  const closeNotificationModals = () => setModal({ type: null, isOpen: false, id: null });

  const title = allData[categoryPath]?.title || 'Categoría';

  return (
    <AdminLayout title={title}>
      {/* --- CAMBIO REALIZADO: Añadimos el componente de notificación aquí --- */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '' })} // Esto limpia el mensaje cuando la notificación se oculta
      />

      {/* --- BARRA DE FILTROS Y ACCIONES (SIN CAMBIOS) --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="w-full md:w-auto">
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
          <select 
            id="subcategory"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="w-full md:w-auto bg-brand-blue text-black font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-black transition-colors md:self-end"
          >
            <option value="all">Todas</option>
            {subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto bg-brand-blue text-black font-bold px-6 py-3 rounded-lg hover:bg-blue-700 hover:text-white transition-colors self-end"
        >
          + Añadir Pregunta
        </button>
      </div>

      {/* --- LISTA DE PREGUNTAS (SIN CAMBIOS) --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Preguntas</h2>
        {isLoading ? (
          <p>Cargando...</p>
        ) : filteredQuestions.length > 0 ? (
          filteredQuestions.map(q => (
            <QuestionCard 
              key={q.id} 
              question={q}
              onEdit={() => openEditModal(q)}
              onDelete={() => handleDeleteClick(q.id)}
            />
          ))
        ) : (
          <p className="text-gray-500 bg-gray-100 p-6 rounded-lg">No hay preguntas para esta subcategoría.</p>
        )}
      </div>
      
      {/* --- MODALES (SIN CAMBIOS) --- */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)}>
        <QuestionForm 
          initialData={editingQuestion} 
          onSave={handleSaveQuestion} 
          onClose={() => setIsFormModalOpen(false)} 
        />
      </Modal>

      <ConfirmationModal
        show={modal.type === 'deleteConfirm' && modal.isOpen}
        title="¿Estás seguro de eliminar esta pregunta?"
        onConfirm={handleConfirmDelete} 
        onClose={closeNotificationModals}
      />
      <SuccessModal
        show={modal.type === 'deleteSuccess' && modal.isOpen}
        message="¡Pregunta eliminada correctamente!" 
        onClose={closeNotificationModals}
      />
    </AdminLayout>
  );
}