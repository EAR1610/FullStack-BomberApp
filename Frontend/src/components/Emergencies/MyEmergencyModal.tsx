import MapComponent from '../Maps/MapComponent';
import { EmergencyModalProps } from '../../helpers/Interfaces';

const MyEmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, emergencyData, isUser }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl transform transition-all max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Detalles de la Emergencia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 mb-2">
            <p><strong>Solicitante:</strong> {emergencyData.applicant}</p>
            <p><strong>Dirección:</strong> {emergencyData.address}</p>
            <p><strong>Descripción:</strong> {emergencyData.description}</p>
            <p className='mb-2'><strong>Tipo Emergencia:</strong> {emergencyData.emergencyType.name}</p>
            <p><strong>Estado: </strong> 
              <span
                className={`
                  px-2 py-1 rounded-lg font-semibold text-white
                  ${emergencyData.status === 'Registrada' ? 'bg-blue-500' : ''}
                  ${emergencyData.status === 'En proceso' ? 'bg-yellow-500' : ''}
                  ${emergencyData.status === 'Atendida' ? 'bg-green-500' : ''}
                  ${emergencyData.status === 'Cancelada' ? 'bg-red-500' : ''}
                  ${emergencyData.status === 'Rechazada' ? 'bg-red-700' : ''}
                `}
              >
                { emergencyData.status }
              </span>
            </p>
            {emergencyData.status === 'Cancelada' || emergencyData.status === 'Rechazada' ? (
            <p className="mb-2"><strong>Motivo:</strong> {emergencyData.reason}</p>
          ) : null}
          </div>
  
          <MapComponent latitude={emergencyData.latitude} longitude={emergencyData.longitude} isUser={isUser} />
                    
          <button
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg w-full"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
}

export default MyEmergencyModal