import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../../interface/Auth";
import { AuthContext } from "../../../context/AuthContext";
import { apiRequestAuth, socketIoURL } from "../../../lib/apiRequest";

import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button'; // Importar el botón de PrimeReact
import { handleErrorResponse } from "../../../helpers/functions";
import TableEmergenciesReport from "../../../components/Table/TableEmergenciesReport";

const ReportEmergency = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null); 
  
  const handleSearch = async () => {
    const formatDate = (date: any) => {
      if (!date) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };
  
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    try {
        const formData = new FormData();
        formData.append('startDate', String(formattedStartDate));
        formData.append('endDate', String(formattedEndDate));
        const response = await apiRequestAuth.post("/emergencies/emergencies-by-date", formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        setEmergencies(response.data);
        console.log(response.data);
    } catch (err) {
        showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  const handleReport = async () => {
    if (emergencies.length < 1) {
        showAlert('warn', 'Error', 'No hay emergencias para generar el reporte');
        return;
    }
  }

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (
    <div className="p-6">
     <Toast ref={toast} />
     <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        
        <div className="flex-auto">
            <label htmlFor="startDate" className="font-bold block mb-2 text-gray-700 dark:text-gray-300">
            Fecha de inicio
            </label>
            <Calendar
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.value)}
            showIcon
            className="w-full"
            placeholder="Selecciona la fecha de inicio"
            />
        </div>

        <div className="flex-auto">
            <label htmlFor="endDate" className="font-bold block mb-2 text-gray-700 dark:text-gray-300">
            Fecha de fin
            </label>
            <Calendar
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.value)}
            showIcon
            className="w-full"
            placeholder="Selecciona la fecha de fin"
            />
        </div>

        <div className="flex-auto md:flex-none flex flex-col space-y-2">
            <Button
            label="Buscar Emergencias"
            icon="pi pi-search"
            className="w-full md:w-auto bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            onClick={handleSearch}
            />
            <Button
            label="Generar reporte"
            icon="pi pi-file"
            className="w-full md:w-auto bg-red-500 text-white hover:bg-red-600 transition-colors"
            onClick={handleReport}
            />
        </div>
    </div>


      {/* Segundo div (aquí puedes continuar con el contenido) */}
      <div>
        <TableEmergenciesReport data={emergencies} />
      </div>
    </div>
  )
}

export default ReportEmergency