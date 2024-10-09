import { useContext, useRef, useState } from "react";
import { AuthContextProps } from "../../../interface/Auth";
import { AuthContext } from "../../../context/AuthContext";
import { apiRequestAuth } from "../../../lib/apiRequest";

import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { handleErrorResponse } from "../../../helpers/functions";
import TableEmergenciesReport from "../../../components/Table/TableEmergenciesReport";
import { ColumnMeta } from "../../../helpers/Interfaces";

const ReportEmergency = () => {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errorMessages, setErrorMessages] = useState<string>('');  
  const [viewGenerateReport, setViewGenerateReport] = useState<boolean>(false);
  const [typeReport, setTypeReport] = useState<string>('Pdf');

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null); 

  const cols: ColumnMeta[] = [
    { field: 'fullName', header: 'Nombre' },
    { field: 'username', header: 'DPI' },
    { field: 'applicant', header: 'Solicitante' },
    { field: 'emergencyType.name', header: 'Tipo' },
    { field: 'address', header: 'Dirección' },
    { field: 'description', header: 'Descripción' },
  ];

  const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

  const exportPdf = () => {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default(0, 0);

            doc.autoTable(exportColumns, emergencies);
            doc.save('emergencias.pdf');
        });
    });
};

const exportExcel = () => {
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(emergencies);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'emergencias');
  });
};

const saveAsExcelFile = (buffer, fileName) => {
  import('file-saver').then((module) => {
      if (module && module.default) {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data = new Blob([buffer], {
              type: EXCEL_TYPE
          });

          module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
  });
};
  
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
        if( formattedEndDate == null || formattedStartDate == null ){
          showAlert('warn', 'Error', 'La fecha de inicio y la fecha de fin son obligatorias');
          return;
        }

        if( formattedEndDate < formattedStartDate ){
          showAlert('warn', 'Error', 'La fecha de fin debe ser mayor a la fecha de inicio');
          return;
        }
                 
        const formData = new FormData();
        formData.append('startDate', String(formattedStartDate));
        formData.append('endDate', String(formattedEndDate));
        const response = await apiRequestAuth.post("/emergencies/emergencies-by-date", formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        setEmergencies(response.data);
        if( response.data.length === 0 ) showAlert('warn', 'Error', 'No hay emergencias para generar el reporte');

    } catch (err) {
        showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  const handleReportType = async () => {
    if (emergencies.length < 1) {
        showAlert('warn', 'Error', 'No hay emergencias para generar el reporte');
        return;
    }
    setViewGenerateReport(true);
  }
  
  const handleReport = async () => {
    if (typeReport === 'Pdf') {
      exportPdf();
    } else {
      exportExcel();
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
            dateFormat="dd/mm/yy"
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
            dateFormat="dd/mm/yy"
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
            onClick={handleReportType}
            />
        </div>
    </div>

      <div>

        <Dialog header="Generar reporte" visible={viewGenerateReport} onHide={() => setViewGenerateReport(false)}
          style={{ width: '35vw' }} breakpoints={{ '641px': '90vw' }}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex align-items-center">
              <RadioButton inputId="Pdf" name="Pdf" value="Pdf" onChange={(e: RadioButtonChangeEvent) => setTypeReport(e.value)} checked={typeReport === 'Pdf'} />
              <label htmlFor="ingredient1" className="ml-2">Pdf</label>
            </div>
            <div className="flex align-items-center">
              <RadioButton inputId="Excel" name="Excel" value="Excel" onChange={(e: RadioButtonChangeEvent) => setTypeReport(e.value)} checked={typeReport === 'Excel'} />
              <label htmlFor="ingredient1" className="ml-2">Excel</label>
            </div>
            <Button label="Generar" icon="pi pi-file" className="w-full md:w-auto bg-blue-500 text-white hover:bg-blue-600 transition-colors" onClick={handleReport} />
          </div>
        </Dialog>
        <TableEmergenciesReport data={emergencies} />
      </div>
    </div>
  )
}

export default ReportEmergency