import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-brand-red mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={onClose} variant="cancel">
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="danger" className="bg-brand-red">
            Eliminar
          </Button>
        </div>
      </Card>
    </div>
  );
};
// Necesitamos un componente Card básico para este modal
const Card = ({ children, className = '' }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
);


export default ConfirmationModal;