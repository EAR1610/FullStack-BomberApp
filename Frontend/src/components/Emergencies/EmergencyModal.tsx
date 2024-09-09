import React from 'react'
import { EmergencyModalProps } from '../../helpers/Interfaces'
import MapComponent from '../Maps/MapComponent';

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, emergencyData }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Detalles de la Emergencia</h2>
        <p><strong>Solicitante:</strong> {emergencyData.emergency.applicant}</p>
        <p><strong>Dirección:</strong> {emergencyData.emergency.address}</p>
        <p><strong>Descripción:</strong> {emergencyData.emergency.description}</p>
        <p className='mb-2'><strong>Tipo Emergencia:</strong> {emergencyData.emergency.emergencyType.name}</p>

        <MapComponent latitude={emergencyData.emergency.latitude} longitude={emergencyData.emergency.longitude} />
        
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

export default EmergencyModal