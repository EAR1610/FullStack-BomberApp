import{ useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import { apiRequestAuth } from "../../lib/apiRequest"
import { FilterMatchMode } from "primereact/api"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog } from "primereact/confirmdialog"
import { Button } from 'primereact/button';
import { ConnectionStatus, useInternetConnectionStatus } from "../../hooks/useInternetConnectionStatus"
import { handleErrorResponse } from "../../helpers/functions"

const SetVehicleEmergency = ({ idEmergency, statusEmergency }:any ) => {

    const [vehicles, setVehicles] = useState([]);
    const [vechiclesEmergency, setVechiclesEmergency] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedVehicleEmergency, setSelectedVehicleEmergency] = useState(null);
    const [mileageOutput, setMileageOutput] = useState(0);
    const [mileageInbound, setMileageInbound] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isUpdateVehicleEmergency, setIsUpdateVehicleEmergency] = useState(false);
    const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      mileageInbound: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      mileageOutput: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      "vehicle.brand": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      "vehicle.model": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      "emergency.description": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      "vehicle.plateNumber": { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [updateTableVehicleEmergency, setUpdateTableVehicleEmergency] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    const toast = useRef(null);
    const connectionStatus = useInternetConnectionStatus();

    const onGlobalFilterChange = (e:any) => {
      const value = e.target.value;
      let _filters = { ...filters };
  
      _filters['global'].value = value;
  
      setFilters(_filters);
      setGlobalFilterValue(value);
  }; 

    useEffect(() => {
      const getVehicles = async () => {
        try {
          const response = await apiRequestAuth.get("/vehicle", {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          })
          if( response ) setVehicles(response.data);
        } catch (error) {
          showAlert("error", "Error", "Error al obtener los vehículos");
        }
      }

      const getVehicleEmergency = async () => {
        try {
          const response = await apiRequestAuth.get(`/vehicle-emergency/${idEmergency}`, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          })
          if( response ) setVechiclesEmergency(response.data);
          setLoading(false);
        } catch (error) {
          showAlert("error", "Error", "Error al obtener los vehículos de emergencias");
        }
      }

      getVehicles();
      getVehicleEmergency();
    }, [updateTableVehicleEmergency]);
    

    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (connectionStatus === ConnectionStatus.Offline) {
        showAlert("error", "No tienes conexión a internet. Revisa tu conexión.", "Error");
        return;
      }

      if( statusEmergency === 'Atendida' || statusEmergency === 'Cancelada' || statusEmergency === 'Rechazada' ){
        showAlert("error", "Error", "No se puede asignar una unidad a una emergencia que ya está en estado: " + statusEmergency);
        return;
      }
      
      if( mileageInbound < mileageOutput ) {
        showAlert("error", "Error", "El kilometro de entrada debe ser mayor o igual que el de salida");
        return;
      }

      try {
        const createVehicleEmergencyFormData = new FormData();
        createVehicleEmergencyFormData.append("vehicleId", String(selectedVehicle?.id));
        createVehicleEmergencyFormData.append('emergencyId', String(idEmergency));
        createVehicleEmergencyFormData.append('mileageInbound', String(mileageInbound));
        createVehicleEmergencyFormData.append('mileageOutput', String(mileageOutput));

        if( isUpdateVehicleEmergency ) {
          await apiRequestAuth.put(`/vehicle-emergency/${selectedVehicleEmergency?.id}`, createVehicleEmergencyFormData, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          })
        } else {
          await apiRequestAuth.post("/vehicle-emergency", createVehicleEmergencyFormData, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          })            
        }

        showAlert("success", "Éxito", `${ isUpdateVehicleEmergency ? "Se ha actualizado" : "Se ha registrado"} la emergencia`);
        setUpdateTableVehicleEmergency(!updateTableVehicleEmergency);
        setIsUpdateVehicleEmergency(false);
        cleanData();
        
      } catch (err) {
        showAlert("error", "Error", handleErrorResponse(err, setErrorMessages));
      }
    }    

    const cleanData = () => {
      setMileageOutput(0);
      setMileageInbound(0);
      setSelectedVehicle(null);
      setSelectedVehicleEmergency(null);
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

    const editVehicleEmergency = (rowData:any) => {
      setSelectedVehicleEmergency(rowData);
      const selected = vehicles.find((vehicle: any) => vehicle.id === rowData.vehicle.id);
      setSelectedVehicle(selected || null);
      setMileageOutput(rowData.mileageOutput);
      setMileageInbound(rowData.mileageInbound);
      setIsUpdateVehicleEmergency(true);
    }
  
    const optionsBodyTemplate = (rowData:any) => {
      return (
        <div className="flex items-center space-x-4">
            <Button
                size='small'
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-button-sm"
                onClick={() => editVehicleEmergency(rowData)}
                style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
            />
        </div>
    )};    

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
      <Toast ref={toast} />
      <div className="flex flex-wrap items-center justify-center">            
        <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Establece las unidades para la emergencia en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
              <div className="mb-4">
                <label htmlFor='vehicle' className="mb-2.5 block font-medium text-black dark:text-white">
                  Vehículo
                </label>
                <div className="relative">
                  <Dropdown
                    id="vehicle"
                    value={ selectedVehicle }
                    options={vehicles.map((vehicle: any) => ({
                      label: `${vehicle.brand} ${vehicle.model} - ${vehicle.plateNumber}`,
                      value: vehicle 
                    }))}
                    onChange={(e) => setSelectedVehicle(e.value)}
                    placeholder="Selecciona el vehículo para la emergencia"
                    className="w-full"
                  />
                </div>
              </div>
    
              <div className="flex flex-wrap justify-between">
                <div className="mb-4 w-full md:w-1/2">
                  <label htmlFor='mileageOutput' className="mb-2.5 block font-medium text-black dark:text-white">
                    Kilometraje de salida
                  </label>
                  <div className="relative">
                    <input
                      id='mileageOutput'
                      type="number"
                      placeholder="Ingrese el kilometraje de salida"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={mileageOutput}
                      min={0}
                      onChange={ (e) => setMileageOutput(parseFloat(e.target.value) || 0) }
                    />
                  </div>
                </div>

                <div className="mb-4 w-full md:w-1/2">
                  <label htmlFor='mileageInBound' className="mb-2.5 block font-medium text-black dark:text-white">
                    Kilometraje de entrada
                  </label>
                  <div className="relative">
                    <input
                      id='mileageInBound'
                      type="number"
                      placeholder="Ingrese el kilometraje de entrada"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={mileageInbound}
                      min={0}
                      onChange={ (e) => setMileageInbound(parseFloat(e.target.value) || 0) }
                    />
                  </div>
                </div>
              </div>

              <div className="mb-5 mt-5">
                <input
                  type="submit"
                  value={isUpdateVehicleEmergency ? 'Actualizar vehiculo para la emergencia' : 'Registrar vehiculo para la emergencia'}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 uppercase"
                />
              </div>
            </form>
    
            <div className="card p-4 bg-gray-100 rounded-lg shadow-md">
              <Toast ref={toast} />
              <ConfirmDialog />
              <DataTable
                className='bg-white rounded-md overflow-hidden'
                value={vechiclesEmergency}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                loading={loading}
                globalFilterFields={['vehicle.plateNumber', 'vehicle.brand', 'vehicle.model', 'emergency.description', 'mileageInbound', 'mileageOutput']}
                header={header}
                emptyMessage="Registro no encontrado."
              >
                <Column field="vehicle.brand" header="Marca"  style={{ minWidth: '4rem' }} align={'center'} />
                <Column field="vehicle.model" header="Modelo"  style={{ minWidth: '4rem' }} align={'center'} />
                <Column field="vehicle.plateNumber" header="Placa"  style={{ minWidth: '4rem' }} align={'center'} />
                <Column field="mileageInbound" header="Kilometraje entrada"  style={{ minWidth: '4rem' }} align={'center'} />
                <Column field="mileageOutput" header="Kilometraje salida"  style={{ minWidth: '4rem' }} align={'center'} />
                <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '4rem' }} />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>  
  )
}

export default SetVehicleEmergency