import { UserCheck } from 'lucide-react';
import Button from './Button';

const SuccessModal = ({ show, onClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-brand-blue rounded-lg shadow-xl p-8 text-center text-black w-full max-w-md mx-4 transform transition-all scale-100">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-400 bg-opacity-50 mb-6">
          <UserCheck size={48} />
        </div>
        <h3 className="text-2xl font-semibold mb-6">{message}</h3>
        <Button onClick={onClose} variant="primary" className="bg-white text-brand-blue hover:bg-white-600">
          Aceptar
        </Button>
      </div>
    </div>
  );
};

export default SuccessModal;