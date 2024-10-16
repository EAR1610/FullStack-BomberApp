import { EmergencyCardProps } from "../../helpers/Interfaces"

const MyEmergencyCard: React.FC<EmergencyCardProps> = ({
  applicant,
  address,
  description,
  user,
  onShowDetails,
}: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900  text-center mb-4">
          Solicitante: {applicant}
        </h2>
        <p className="text-sm text-gray-700 text-center">
          Usuario: {user.fullName}
        </p>
        <p className="text-sm text-gray-700 text-center">
          Dirección: {address}
        </p>
        <p className="text-sm text-gray-700 text-center mb-4">
          Descripción: {description}
        </p>
        <button
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-300"
          onClick={onShowDetails}
        >
          Ver Detalles
        </button>
      </div>
    </div>

  );
};

export default MyEmergencyCard