import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { EmergencyModalProps } from '../../helpers/Interfaces';
import MapComponent from '../Maps/MapComponent';
import DetailEmergency from '../../pages/Emergency/DetailEmergency';

/**
 * 
 * This TypeScript code snippet defines a functional component called `EmergencyModal`. It is a React component that renders a modal dialog for displaying details of an emergency. 

The component takes in three props: `isOpen`, `onClose`, and `emergencyData`. `isOpen` is a boolean that determines whether the modal is open or not. `onClose` is a function that is called when the modal is closed. `emergencyData` is an object that contains the data of the emergency to be displayed.

Inside the component, it uses the `useState` hook to manage the state of `viewDetailEmergency`, which determines whether the detailed view of the emergency is visible or not.

The component conditionally renders a `null` value if `isOpen` is `false`. Otherwise, it renders a modal dialog with a header, content, and actions. The content includes the formatted creation date and time of the emergency, the user associated with the emergency, the applicant, the address, the description, and the status of the emergency. The status is displayed with a colored background based on its value.

The component also renders a `MapComponent` with the latitude and longitude of the emergency's location.

There are two buttons in the modal: one to view the detailed view of the emergency and another to close the modal.

The detailed view of the emergency is displayed in a `Dialog` component, which is conditionally rendered based on the value of `viewDetailEmergency`. The `DetailEmergency` component is passed the emergency's ID, a function to toggle the detailed view, and the emergency's status.

Overall, this component is responsible for displaying the details of an emergency in a modal dialog.
 */

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, emergencyData }) => {
  const [viewDetailEmergency, setViewDetailEmergency] = useState(false);

  if (!isOpen) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-11/12 max-w-md lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl transform transition-all">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Detalles de la Emergencia
        </h2>

        <div className="space-y-2 text-gray-700 dark:text-gray-300 mb-2">
          <p><strong>Hora de la solicitud:</strong>{ formatDateTime(emergencyData.createdAt) }</p>
          <p><strong>Usuario:</strong>{ emergencyData.firefighter.user.fullName }</p>
          <p><strong>Solicitante:</strong> {emergencyData.emergency.applicant}</p>
          <p><strong>Dirección:</strong> {emergencyData.emergency.address}</p>
          <p><strong>Descripción:</strong> {emergencyData.emergency.description}</p>
          <p><strong>Estado:</strong> 
            <span
              className={`
                px-2 py-1 rounded-lg font-semibold text-white ml-2
                ${emergencyData.emergency.status === 'Registrada' ? 'bg-blue-500' : ''}
                ${emergencyData.emergency.status === 'En proceso' ? 'bg-yellow-500' : ''}
                ${emergencyData.emergency.status === 'Atendida' ? 'bg-green-500' : ''}
                ${emergencyData.emergency.status === 'Cancelada' ? 'bg-red-500' : ''}
                ${emergencyData.emergency.status === 'Rechazada' ? 'bg-red-700' : ''}
              `}
            >
              {emergencyData.emergency.status}
            </span>
          </p>
        </div>

        <MapComponent
          latitude={emergencyData.emergency.latitude}
          longitude={emergencyData.emergency.longitude}
          isUser={emergencyData.firefighter.user.isUser}
        />

        <div className="mt-6 space-y-4">
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            onClick={() => setViewDetailEmergency(true)}
          >
            Establecer Detalle
          </button>
          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <Dialog
          header="Detalle Emergencia"
          visible={viewDetailEmergency}
          onHide={() => setViewDetailEmergency(false)}
          style={{ width: '90vw' }}
          breakpoints={{ '960px': '90vw', '641px': '100vw' }}
        >
          <DetailEmergency
            idEmergency={emergencyData.emergency.id}
            setViewDetailEmergency={setViewDetailEmergency}
            statusEmergency={emergencyData.emergency.status}
            isFirefighter={emergencyData.emergency.user.isFirefighter}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default EmergencyModal;
