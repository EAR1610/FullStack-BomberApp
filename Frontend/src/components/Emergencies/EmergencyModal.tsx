import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { EmergencyModalProps } from '../../helpers/Interfaces'
import MapComponent from '../Maps/MapComponent';
import DetailEmergency from '../../pages/Emergency/DetailEmergency';

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, emergencyData }) => {
  if (!isOpen) return null;
  const [viewDetailEmergency, setViewDetailEmergency] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
        <h2 className="text-lg font-semibold mb-4">Detalles de la Emergencia</h2>
        <p><strong>Solicitante:</strong> {emergencyData.emergency.applicant}</p>
        <p><strong>Dirección:</strong> {emergencyData.emergency.address}</p>
        <p><strong>Descripción:</strong> {emergencyData.emergency.description}</p>
        <p className='mb-2'><strong>Tipo Emergencia:</strong> {emergencyData.emergency.emergencyType.name}</p>

        <MapComponent latitude={emergencyData.emergency.latitude} longitude={emergencyData.emergency.longitude} />
        
        <button
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg w-full"
          onClick={ () => setViewDetailEmergency(true) }
        >
          Establecer Detalle
        </button>
        <button
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg w-full"
          onClick={onClose}
        >
          Cerrar
        </button>
        <Dialog header="Detalle Emergencia" visible={viewDetailEmergency} onHide={() => setViewDetailEmergency(false)}
        style={{ width: '90vw' }} breakpoints={{ '960px': '90vw', '641px': '100vw' }}>
        <DetailEmergency idEmergency={emergencyData.emergency.id} setViewDetailEmergency={ setViewDetailEmergency } statusEmergency={emergencyData.emergency.status} />
      </Dialog>
      </div>
    </div>
  );
}

export default EmergencyModal