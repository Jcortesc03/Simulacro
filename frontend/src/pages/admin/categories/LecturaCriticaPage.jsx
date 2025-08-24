import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../../../components/questions/QuestionCard';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import SuccessModal from '../../../components/ui/SuccessModal';
import AdminLayout from '../../../components/layout/AdminLayout';

// Datos de ejemplo
const questionsData = [
    {
      id: 1,
      enunciado: null,
      pregunta: "Según el texto, ¿cuál de las siguientes opciones NO es una característica de los dinosaurios?",
      opciones: [
        { texto: "A) Eran reptiles.", esCorrecta: false },
        { texto: "B) Vivieron durante la era Mesozoica.", esCorrecta: false },
        { texto: "C) Algunos eran carnívoros.", esCorrecta: false },
        { texto: "D) Tenían la capacidad de volar.", esCorrecta: true }
      ],
      dificultad: "Facil",
      editadoPor: "Abraham gomez"
    }
  // ... más preguntas aquí
];


const LecturaCriticaPage = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState({ type: null, isOpen: false }); // type: 'deleteConfirm', 'deleteSuccess', etc.

    const handleDeleteClick = () => {
        setModal({ type: 'deleteConfirm', isOpen: true });
    };

    const handleConfirmDelete = () => {
        console.log("Eliminando pregunta...");
        setModal({ type: 'deleteSuccess', isOpen: true });
    };

    return (
        <AdminLayout title="Lectura Crítica">
            {/* --- SECCIÓN DE FILTROS Y ACCIONES --- */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="w-full md:w-auto">
                    <label htmlFor="subcategory" className="sr-only">Subcategoría</label>
                    <select id="subcategory" className="w-full md:w-64 p-3 border border-gray-300 rounded-lg bg-white">
                        <option>Literal</option>
                        <option>Inferencial</option>
                        <option>Analítica</option>
                    </select>
                </div>
                <button
                    onClick={() => navigate('/admin/questions/add')}
                    className="w-full md:w-auto bg-brand-blue text-black font-bold px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    + Add Question
                </button>
            </div>

            {/* --- LISTA DE PREGUNTAS --- */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Preguntas</h2>
                {questionsData.map(q => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        onEdit={() => navigate(`/admin/questions/edit/${q.id}`)}
                        onDelete={handleDeleteClick}
                    />
                ))}
            </div>

            {/* --- MODALES --- */}
            <ConfirmationModal
                show={modal.type === 'deleteConfirm' && modal.isOpen}
                title="¿Estás seguro de eliminar esta pregunta?"
                confirmText="SI"
                cancelText="NO"
                onConfirm={handleConfirmDelete}
                onClose={() => setModal({ isOpen: false, type: null })}
            />
            <SuccessModal
                show={modal.type === 'deleteSuccess' && modal.isOpen}
                message="¡Pregunta eliminada correctamente!"
                onClose={() => setModal({ isOpen: false, type: null })}
            />
        </AdminLayout>
    );
};

export default LecturaCriticaPage;
