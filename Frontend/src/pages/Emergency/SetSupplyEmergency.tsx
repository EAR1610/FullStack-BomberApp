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

const SetSupplyEmergency = ({ idEmergency, statusEmergency }:any) => {

    const [supplies, setSupplies] = useState([]);
    const [suppliesEmergency, setSuppliesEmergency] = useState<any[]>([]);
    const [selectedSupply, setSelectedSupply] = useState(null);
    const [selectedSupplyEmergency, setSelectedSupplyEmergency] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isUpdateSupplyEmergency, setIsUpdateSupplyEmergency] = useState(false);
    const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      "supply.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      "emergency.description": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      quantity: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [updateTableSupplyEmergency, setUpdateTableSupplyEmergency] = useState(false);
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
    const getSupplies = async () => {
      try {
        const response = await apiRequestAuth.get("/supply", {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        })
        if( response ) setSupplies(response.data);
      } catch (error) {
        showAlert("error", "Error", "Error al obtener los insumos");
      }
    }

    const getSuppliesEmergency = async () => {
      try {
        const response = await apiRequestAuth.post(`/supply-emergency/supplies-per-emergency/${idEmergency}`, {}, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        })
        if( response ) setSuppliesEmergency(response.data);
        setLoading(false);
      } catch (error) {
        showAlert("error", "Error", "Error al obtener los insumos de emergencias");
      }
    }

    getSupplies();
    getSuppliesEmergency();
  }, [updateTableSupplyEmergency]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = parseInt(value, 10);
    
    if (!isNaN(numericValue) && numericValue <= 99) {
      setQuantity(numericValue);
    } else if (value === '') {
      setQuantity(0); 
    }
  };


  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (connectionStatus === ConnectionStatus.Offline) {
        showAlert("error", "No tienes conexión a internet. Revisa tu conexión.", "Error");
        return;
      }
      
      if( quantity <= 0 ) {
        showAlert("error", "Error", "La cantidad del insumo debe ser mayor a cero");
        return;
      }
      
      if( selectedSupply === null ) {
        showAlert("error", "Error", "Debe seleccionar un insumo");
        return;
      }

      if( statusEmergency === 'Atendida' || statusEmergency === 'Cancelada' || statusEmergency === 'Rechazada' ){
        showAlert("error", "Error", "No se puede asignar un insumo a una emergencia que ya está en estado: " + statusEmergency);
        return;
      }

      try {
        const createSupplyEmergencyFormData = new FormData();
        createSupplyEmergencyFormData.append("supplyId", String(selectedSupply?.id));
        createSupplyEmergencyFormData.append('emergencyId', String(idEmergency));
        createSupplyEmergencyFormData.append('quantity', String(quantity));

        if( isUpdateSupplyEmergency ) {
          await apiRequestAuth.put(`/supply-emergency/${selectedSupplyEmergency?.id}`, createSupplyEmergencyFormData, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          })
        } else {
          await apiRequestAuth.post("/supply-emergency", createSupplyEmergencyFormData, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          })            
        }

        showAlert("success", "Éxito", `${ isUpdateSupplyEmergency ? "Se ha actualizado" : "Se ha registrado"} el insumo de la emergencia`);
        setUpdateTableSupplyEmergency(!updateTableSupplyEmergency);
        setIsUpdateSupplyEmergency(false);
        cleanData();
        
      } catch (error) {
        showAlert("error", "Error", handleErrorResponse(error));
      }
    }

    const handleErrorResponse = (error: any) => {      
        if (error.response && error.response.data && error.response.data.errors) {
          const errorMessages = error.response.data.errors
            .map((err: { message: string }) => err.message)
            .join(', ');
            setErrorMessages(errorMessages);
        } else {
          setErrorMessages('Ocurrió un error inesperado');
        }
        return errorMessages
      };
  
      const cleanData = () => {
        setQuantity(0);
        setSelectedSupply(null);
        setSelectedSupplyEmergency(null);
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
  
      const editSupplyEmergency = (rowData:any) => {
        setSelectedSupplyEmergency(rowData);
        const selected = supplies.find((supply: any) => supply.id === rowData.supply.id);
        setSelectedSupply(selected || null);
        setQuantity(rowData.quantity);
        setIsUpdateSupplyEmergency(true);
      }

      const optionsBodyTemplate = (rowData:any) => {
        return (
          <div className="flex items-center space-x-4">
              <Button
                  size='small'
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success p-button-sm"
                  onClick={() => editSupplyEmergency(rowData)}
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
              Establece los insumos para la emergencia en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
              <div className="mb-4">
                <label htmlFor='supply' className="mb-2.5 block font-medium text-black dark:text-white">
                  Insumo
                </label>
                <div className="relative">
                  <Dropdown
                    id="supply"
                    value={ selectedSupply }
                    options={supplies.map((supply: any) => ({
                      label: `${supply.name} - ${supply.supplyType.name}`,
                      value: supply
                    }))}
                    onChange={(e) => setSelectedSupply(e.value)}
                    placeholder="Selecciona el insumo para la emergencia"
                    className="w-full"
                  />
                </div>
              </div>
    
                <div className="mb-4 w-full">
                  <label htmlFor='quantity' className="mb-2.5 block font-medium text-black dark:text-white">
                    Cantidad
                  </label>
                  <div className="relative">
                    <input
                      id='quantity'
                      type="number"
                      placeholder="Ingrese la cantidad de insumo para la emergencia"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={quantity}
                      min={0}
                      max={99}
                      onChange={handleQuantityChange}
                    />
                  </div>
                </div> 

              <div className="mb-5 mt-5">
                <input
                  type="submit"
                  value={isUpdateSupplyEmergency ? 'Actualizar insumo para la emergencia' : 'Registrar insumo para la emergencia'}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 uppercase"
                />
              </div>
            </form>
    
            <div className="card p-4 bg-gray-100 rounded-lg shadow-md">
              <Toast ref={toast} />
              <ConfirmDialog />
              <DataTable
                className='bg-white rounded-md overflow-hidden'
                value={suppliesEmergency.length ? suppliesEmergency : []} 
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                loading={loading}
                globalFilterFields={[ 'supply.name', 'quantity', 'emergency.description']}
                header={header}
                emptyMessage="Registro no encontrado."
              >
                <Column field="supply.name" header="Insumo"  style={{ minWidth: '4rem' }} align={'center'} />
                <Column field="emergency.description" header="Descripción emergencia"  style={{ minWidth: '4rem' }} align={'center'} />
                <Column field="quantity" header="Cantidad"  style={{ minWidth: '4rem' }} align={'center'} />
                <Column header="Opciones" body={optionsBodyTemplate} style={{ minWidth: '4rem' }} />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetSupplyEmergency