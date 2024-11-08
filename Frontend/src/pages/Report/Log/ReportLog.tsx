import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../../interface/Auth";
import { AuthContext } from "../../../context/AuthContext";
import { apiRequestAuth } from "../../../lib/apiRequest";

import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { handleErrorResponse } from "../../../helpers/functions";
import { ColumnMeta } from "../../../helpers/Interfaces";
import { useNavigate } from "react-router-dom";
import TableLogsReport from "../../../components/Table/TableLogsReport";

const ReportLog = () => {

  const [logs, setLogs] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errorMessages, setErrorMessages] = useState<string>('');
  const [viewGenerateReport, setViewGenerateReport] = useState<boolean>(false);
  const [typeReport, setTypeReport] = useState<string>('Pdf');
  const today = new Date();

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken, updateToken } = authContext;

  const navigate = useNavigate();
  const toast = useRef(null);
  
  useEffect(() => {
    if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
    if( currentToken?.user.isUser ) navigate('/app/emergency-request');
  }, []);

  const cols: ColumnMeta[] = [
    { field: 'actio_type', header: 'Acción' },
    { field: 'entity_type', header: 'Entidad' },
    { field: 'description', header: 'Descripción' },
    { field: 'date', header: 'Fecha' },
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
          const worksheet = xlsx.utils.json_to_sheet([]); // Inicializa la hoja de trabajo
          const formattedStartDate = startDate ? formatDate(startDate) : 'N/A';
          const formattedEndDate = endDate ? formatDate(endDate) : 'N/A';
          
          // Añadir título centrado y en negrita
          xlsx.utils.sheet_add_aoa(worksheet, [
              [`Reporte de emergencias desde ${formattedStartDate} hasta ${formattedEndDate}`],
              []
          ], { origin: 'A1' });
          
          // Configurar el estilo del título (centrado y negrita)
          const titleCell = worksheet['A1'];
          if (titleCell) {
              titleCell.s = {
                  font: { bold: true }, // Negrita
                  alignment: { horizontal: 'center' } // Centramos el texto
              };
              const rangeTitle = { s: { c: 0, r: 0 }, e: { c: exportColumns.length - 1, r: 0 } };
              worksheet['!merges'] = worksheet['!merges'] || [];
              worksheet['!merges'].push(rangeTitle); // Merge para centrar el título
          }
  
          // Añadir datos de las emergencias
          xlsx.utils.sheet_add_json(worksheet, emergencies, { origin: 'A3', skipHeader: false });
          console.log(emergencies);
          
          // Dar formato a los encabezados de las columnas
          const headerRow = 2; // Fila donde están los encabezados
          exportColumns.forEach((col, idx) => {
              const cell = worksheet[xlsx.utils.encode_cell({ r: headerRow, c: idx })];
              if (cell) {
                  cell.s = {
                      font: { bold: true }, // Negrita
                      alignment: { horizontal: 'center' }, // Centrar encabezados
                      border: { // Aplicar bordes a los encabezados
                          top: { style: 'thin' },
                          bottom: { style: 'thin' },
                          left: { style: 'thin' },
                          right: { style: 'thin' }
                      }
                  };
              }
          });
  
          // Aplicar borde a todas las celdas de la tabla
          const range = xlsx.utils.decode_range(worksheet['!ref']);
          for (let R = range.s.r; R <= range.e.r; ++R) {
              for (let C = range.s.c; C <= range.e.c; ++C) {
                  const cell_address = xlsx.utils.encode_cell({ r: R, c: C });
                  const cell = worksheet[cell_address];
                  if (!cell) continue;
                  cell.s = cell.s || {};
                  cell.s.border = {
                      top: { style: 'thin' },
                      bottom: { style: 'thin' },
                      left: { style: 'thin' },
                      right: { style: 'thin' }
                  };
              }
          }
  
          // Configurar el workbook y guardarlo como archivo Excel
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  
          saveAsExcelFile(excelBuffer, `reporte de emergencias de ${formattedStartDate}`);
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

  const formatDate = (date: any) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const handleSearch = async () => {
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
        const response = await apiRequestAuth.post("/logs/logs-by-date", formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        setLogs(response.data);
        if( response.data.length === 0 ) showAlert('warn', 'Error', 'No hay registros para generar el reporte');

    } catch (err) {
      if(err.request.statusText === 'Unauthorized'){
        showAlert("error", "Sesion expirada", "Vuelve a iniciar sesion");
        setTimeout(() => {
          navigate('/login', { replace: true });
          updateToken('' as any);
        }, 1500);
      } else {
        showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
      }
    }
  };

  const handleReportType = async () => {
    if (logs.length < 1) {
        showAlert('warn', 'Error', 'No hay registros para generar el reporte');
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
              maxDate={today}
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
              maxDate={today}
            />
        </div>

        <div className="flex-auto md:flex-none flex flex-col space-y-2">
            <Button
              label="Buscar Emergencias"
              icon="pi pi-search"
              className="w-full md:w-auto bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              onClick={handleSearch}
            />
            {/* <Button
              label="Generar reporte"
              icon="pi pi-file"
              className="w-full md:w-auto bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={handleReportType}
            /> */}
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
        <TableLogsReport data={logs} />
      </div>
    </div>
  )
}

export default ReportLog