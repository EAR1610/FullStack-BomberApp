import{ useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import MapComponent from "../../components/Maps/MapComponent"
import { apiRequestAuth } from "../../lib/apiRequest"
import { ConfirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import 'primeicons/primeicons.css';    
import { handleErrorResponse } from "../../helpers/functions"


const EmergenciesByFirefighterShift = ({ firefighterShift, setViewEmergencies }: any) => {

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    const userId = currentToken?.user?.id || 1;
    const [errorMessages, setErrorMessages] = useState<string>('');
    const [emergenciesByFirefighterShift, setEmergenciesByFirefighterShift] = useState([]);

    const [filters, setFilters] = useState({
        "emergency.applicant": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "emergency.status": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "emergency.emergencyType.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        "emergency.emergency.description": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const toast = useRef(null);

    const formatMonth = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const formattedDate = `${year}-${month}`;
        return formattedDate;
    };

    useEffect(() => {
      const getEmergenciesByFirefighterShift = async () => {
        const formData = new FormData();
        const formatedMonth = formatMonth(firefighterShift.createdAt);

        if( formatedMonth == null ){
            showAlert('warn', 'Error', 'La fecha de inicio y la fecha de fin son obligatorias');
            return;
        }

        try {
            formData.append('firefighterId', String(firefighterShift.id));
            formData.append('monthYear', String(formatedMonth));
            const response = await apiRequestAuth.post(`/firefighter-emergency/firefighters-by-month`, formData, {
              headers: {
                Authorization: `Bearer ${currentToken?.token}`,
              },
            });

            console.log(response);
            if (response) setEmergenciesByFirefighterShift(response.data);
            setLoading(false);
            
        } catch (err) {
            console.log(err);
            showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
        }
      }

      getEmergenciesByFirefighterShift();
    }, []);

    const onGlobalFilterChange = (e:any) => {
        const value = e.target.value;
        let _filters = { ...filters };
  
        _filters['global'].value = value;
  
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
          <div className="flex flex-wrap justify-between items-center space-y-2 sm:space-y-0 mb-4">
            <IconField iconPosition="left" className="flex-1 sm:max-w-xs">
                <InputIcon className="pi pi-search"/>
                <InputText
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Búsqueda"
                    className="w-full"
                />
            </IconField>
          </div>
        );
    };

    const header = renderHeader();

    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (
    <div className="card p-4 bg-gray-100 rounded-lg shadow-md">
      <Toast ref={toast} />
      
      <ConfirmDialog />
      <DataTable
       className='bg-white rounded-md overflow-hidden'
        value={emergenciesByFirefighterShift}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        header={header}
        globalFilterFields={['emergency.applicant', 'emergency.status', 'emergency.emergencyType.name', 'emergency.description', 'createdAt']}
        emptyMessage="Emergencias no encontradas."
      >
        <Column field="emergency.applicant" header="Solicitante"  style={{ minWidth: '8rem' }}  align={'center'}/>
        <Column field="emergency.emergencyType.name" header="Tipo" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="emergency.description" header="Descripción" style={{ minWidth: '12rem' }} align={'center'}/>        
        <Column field="createdAt" header="Fecha" style={{ minWidth: '12rem' }} align={'center'}/>
        <Column field="emergency.status" header="Estado" style={{ minWidth: '12rem' }} align={'center'}/>
      </DataTable>      
    </div>
  )
}

export default EmergenciesByFirefighterShift