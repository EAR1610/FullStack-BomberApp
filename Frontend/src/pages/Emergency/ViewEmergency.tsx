import{ useContext, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import MapComponent from "../../components/Maps/MapComponent"
import { apiRequestAuth } from "../../lib/apiRequest"
import { Dialog } from "primereact/dialog"
import SetFirefighterEmergency from "../FireFighters/SetFirefighterEmergency"
import SetVehicleEmergency from "./SetVehicleEmergency"
import DetailEmergency from "./DetailEmergency"

const ViewEmergency = ({ emergency, setViewEmergency }: any) => {

    const [viewFirefighterToSetEmergency, setViewFirefighterToSetEmergency] = useState(false);  
    const [viewVehicleSetEmergency, setViewVehicleSetEmergency] = useState(false);
    const [viewDetailEmergency, setViewDetailEmergency] = useState(false);
    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    const [selectedStatus, setSelectedStatus] = useState<string>(emergency?.status || 'Registrada');
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    
    const toast = useRef(null);

    const emergencyStatuses = [
      { label: 'Registrada', value: 'Registrada' },
      { label: 'En proceso', value: 'En proceso' },
      { label: 'Atendida', value: 'Atendida' },
      { label: 'Cancelada', value: 'Cancelada' },
      { label: 'Rechazada', value: 'Rechazada' }
  ];

  console.log(emergency)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      try {    
        const updateEmergencyFormData = new FormData();
        updateEmergencyFormData.append('emergencyTypeId', String(emergency.emergencyTypeId));
        updateEmergencyFormData.append('applicant', emergency.applicant);
        updateEmergencyFormData.append('address', emergency.address);
        updateEmergencyFormData.append('latitude', String(emergency.latitude));
        updateEmergencyFormData.append('longitude', String(emergency.longitude));
        updateEmergencyFormData.append('description', emergency.description);
        updateEmergencyFormData.append('userId', emergency.userId);
        updateEmergencyFormData.append('status', selectedStatus);
    
        await apiRequestAuth.put(`/emergencies/${emergency.id}`, updateEmergencyFormData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          }
        });
    
        showAlert('info', 'Info', 'Emergencia registrada correctamente!');
        setTimeout(() => {
          setViewEmergency(false);
        }, 1500);
      } catch (error) {
        showAlert('error', 'Error', 'No se pudo registrar la emergencia');
      }
    }
    
  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Estas viendo el seguimiento de una emergencia registrada en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
              <div className="mb-4">
                <label htmlFor='applicant' className="mb-2.5 block font-medium text-black dark:text-white">
                  Solicitante
                </label>
                <div className="relative">
                  <input
                    id='applicant'
                    type="text"
                    placeholder="Solicitante de la emergencia"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ emergency?.applicant }
                    disabled                    
                  />
                </div>
              </div>   

              <div className="mb-4">
                <label htmlFor='address' className="mb-2.5 block font-medium text-black dark:text-white">
                  Dirección
                </label>
                <div className="relative">
                  <input
                    id='address'
                    type="text"
                    placeholder="Dirección de la emergencia"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ emergency?.address }
                    disabled                    
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='description' className="mb-2.5 block font-medium text-black dark:text-white">
                  Descripción
                </label>
                <div className="relative">
                  <input
                    id='description'
                    type="text"
                    placeholder="Ingresa la línea de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ emergency?.description }
                    disabled                    
                  />
                </div>
              </div>              

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                Bomberos para la emergencia
                </label>
                <input
                  onClick={ () => setViewFirefighterToSetEmergency(true) }
                  value='Establecer bomberos para la emergencia'
                  className="w-full cursor-pointer rounded-lg border border-yellow bg-yellow-500 p-4 text-white transition hover:bg-opacity-90 text-center uppercase"
                />                
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                Unidades para la emergencia
                </label>
                <input
                  onClick={ () => setViewVehicleSetEmergency(true) }
                  value='Establecer las unidades para la emergencia'
                  className="w-full cursor-pointer rounded-lg border border-yellow bg-green-500 p-4 text-white transition hover:bg-opacity-90 text-center uppercase"
                />
              </div>

              <div className="mb-4">
                <label htmlFor='status' className="mb-2.5 block font-medium text-black dark:text-white">
                  Estado
                </label>
                <div className="relative">
                  <Dropdown
                    id="status"
                    value={selectedStatus}
                    options={emergencyStatuses}
                    onChange={(e) => setSelectedStatus(e.value)}
                    placeholder="Selecciona el estado de la emergencia"
                    className="w-full"
                    disabled={emergency.status === 'Atendida' || emergency.status === 'Cancelada'}
                  />
                </div>
              </div>

              <MapComponent latitude={emergency.latitude} longitude={emergency.longitude} />
              
              <div className="mb-5 mt-5">
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-4 rounded-lg transition-colors duration-300 mb-2 uppercase"
                onClick={e => {
                  e.preventDefault();
                  setViewDetailEmergency(true)
                }}
              >
                Ver Detalle
              </button>
                <input
                  type="submit"
                  value='Modificar estado de la emergencia'
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 uppercase"
                />
              </div>            
            </form>
          </div>
        </div>
      </div>
      <Dialog header="Asignación de bomberos a la emergencia" visible={viewFirefighterToSetEmergency} onHide={() => setViewFirefighterToSetEmergency(false)}
        style={{ width: '90vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <SetFirefighterEmergency idEmergency={emergency?.id} />
      </Dialog>    
      <Dialog header="Asignación de unidades a la emergencia" visible={viewVehicleSetEmergency} onHide={() => setViewVehicleSetEmergency(false)}
        style={{ width: '90vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <SetVehicleEmergency idEmergency={emergency?.id} />
      </Dialog>
      <Dialog
          header="Detalle Emergencia"
          visible={viewDetailEmergency}
          onHide={() => setViewDetailEmergency(false)}
          style={{ width: '90vw' }}
          breakpoints={{ '960px': '90vw', '641px': '100vw' }}
        >
          <DetailEmergency
            idEmergency={emergency.id}
            setViewDetailEmergency={setViewDetailEmergency}
            statusEmergency={emergency.status}
            isFirefighter={emergency.user.isFirefighter}
          />
        </Dialog>
    </div>
  )
}

export default ViewEmergency