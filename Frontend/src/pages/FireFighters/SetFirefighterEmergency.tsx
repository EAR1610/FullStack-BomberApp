import{ useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { apiRequestAuth } from "../../lib/apiRequest"
import { handleErrorResponse } from "../../helpers/functions"
import { Dropdown } from "primereact/dropdown"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog } from "primereact/confirmdialog"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { FilterMatchMode } from "primereact/api"

const SetFirefighterEmergency = ({ idEmergency }: any) => {
  const [firefighters, setFirefighters] = useState([]);
  const [firefightersEmergency, setFirefightersEmergency] = useState([]);
  const [selectedFirefighter, setSelectedFirefighter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    shiftPreference: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "firefighter.user.userName": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "firefighter.user.fullName": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "firefighter.user.address": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");  const { currentToken } = authContext;
  const toast = useRef(null);

  const onGlobalFilterChange = (e:any) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
}; 

  useEffect(() => {
    const getFirefighters = async () => {
      try {
        const response = await apiRequestAuth.get("/firefighter", {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        })
        if (response) setFirefighters(response.data)
      } catch (error) {
        handleErrorResponse(error);
        showAlert("error", "Error", "Ocurrio un error al obtener los bomberos");
      }
    }

    const getFirefighterEmergency = async () => {
      try {
        const response = await apiRequestAuth.get("/firefighter-emergency", {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        })
        if (response) setFirefightersEmergency(response.data)
        console.log(response.data)
        setLoading(false);
      } catch (error) {
        handleErrorResponse(error);
        showAlert("error", "Error", "Ocurrio un error al obtener los bomberos");
      }
    }

    getFirefighters()
    getFirefighterEmergency()
  }, []);

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    debugger
    e.preventDefault();
      try {
        const createFirefighterEmergencyFormData = new FormData();
        createFirefighterEmergencyFormData.append('firefighterId', selectedFirefighter?.id);
        createFirefighterEmergencyFormData.append('emergencyId', idEmergency);
    
        await apiRequestAuth.post('/firefighter-emergency', createFirefighterEmergencyFormData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          }
        });
        showAlert("success", "Asignación exitosa", "Se ha asignado el bombero a la emergencia");
    } catch (error) {
        console.log(error)
        showAlert("error", "Error", "Ocurrio un error al asignar el bombero a la emergencia");
    }
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
          <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda" />
          </IconField>          
      </div>
    );
  };

  const header = renderHeader();
  
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Establece los bomberos para la emergencia en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
              <div className="mb-4">
                <label htmlFor='applicant' className="mb-2.5 block font-medium text-black dark:text-white">
                  Bomberos de turno
                </label>
                <div className="relative">
                    <Dropdown
                    value={ selectedFirefighter }
                    options={ firefighters }
                    onChange={ (e) => setSelectedFirefighter(e.value) }
                    optionLabel="user.fullName"
                    optionValue="id"
                    placeholder="Seleccione el bombero para la emergencia"
                    className="w-full"
                    required
                    />
                </div>
              </div>
              <div className="mb-5 mt-5">
                <input
                  type="submit"
                  value='Establecer bombero para la emergencia'
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 uppercase"
                />
              </div>
            </form>
            <div className="card p-4 bg-gray-100 rounded-lg shadow-md">
                <Toast ref={toast} />
                <ConfirmDialog />
                <DataTable
                className='bg-white rounded-md overflow-hidden'
                value={firefightersEmergency}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                loading={loading}
                globalFilterFields={['shiftPreference', 'user.userName', 'user.fullName', 'user.email']}
                header={header}
                emptyMessage="Registro no encontrado."
                >
                <Column field="firefighter.user.username" header="Usuario"  style={{ minWidth: '4rem' }}  align={'center'} />
                <Column field="firefighter.user.fullName" header="Nombre Completo"  style={{ minWidth: '4rem' }}  align={'center'} />
                <Column field="firefighter.shiftPreference" header="Tipo Turno"  style={{ minWidth: '4rem' }}  align={'center'} />
                </DataTable>                
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetFirefighterEmergency