import { ModalProps } from "../../helpers/Interfaces";

const ModalLocalitationEmergency:React.FC<ModalProps> = ({ isOpen, onClose, onConfirm} ) => {
    if (!isOpen) return null;

  return (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Solicitar Permiso de Ubicación</h2>
        <p className="mb-4">
          Necesitamos acceder a tu ubicación para poder asistir en la emergencia de manera precisa. Por favor, permite el acceso cuando se te solicite.
        </p>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Aceptar</button>
        </div>
      </div>
    </div>
  )
}

export default ModalLocalitationEmergency