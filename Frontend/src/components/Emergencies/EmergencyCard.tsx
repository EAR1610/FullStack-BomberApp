import { EmergencyCardProps } from "../../helpers/Interfaces"

const EmergencyCard: React.FC<EmergencyCardProps> = ({ applicant, address, description, onShowDetails }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 text-center">Soliciante:{applicant}</h2>
          <p className="text-sm text-gray-600 text-center">Dirección:{address}</p>
          <p className="text-sm text-gray-600 text-center">Descripción: {description}</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
            onClick={onShowDetails}
          >
            Ver Detalles
          </button>
        </div>
    );
}

export default EmergencyCard