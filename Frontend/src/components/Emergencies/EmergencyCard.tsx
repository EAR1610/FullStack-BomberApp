import { EmergencyCardProps } from "../../helpers/Interfaces"

const EmergencyCard: React.FC<EmergencyCardProps> = ({
  applicant,
  address,
  description,
  onShowDetails,
}: any) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300 text-center mb-4">
          Solicitante: <span className="font-normal">{applicant}</span>
        </h2>
        <p className="text-sm text-gray-800 dark:text-gray-300 text-center">
          <span className="font-bold text-xl">Dirección: </span><span className="font-normal">{address}</span>
        </p>
        <p className="text-sm text-gray-800 dark:text-gray-300 text-center mb-4">
          <span className="font-bold text-xl">Descripción: </span><span className="font-normal">{description}</span>
        </p>
        <button
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          onClick={onShowDetails}
        >
          Ver Emergencia
        </button>
      </div>
    </div>
  );
};

export default EmergencyCard