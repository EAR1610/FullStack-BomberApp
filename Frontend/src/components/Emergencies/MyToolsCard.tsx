import { ToolPerEmergencyTypeProps } from "../../helpers/Interfaces"

const MyToolsCard: React.FC<ToolPerEmergencyTypeProps> = ( {
    name, brand, model
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-4">
        Nombre: {name}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Marca: {brand}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Modelo: {model}
      </p>
    </div>
  </div>
  )
}

export default MyToolsCard