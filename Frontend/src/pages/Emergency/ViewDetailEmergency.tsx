import{ useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import { apiRequestAuth } from "../../lib/apiRequest"

const ViewDetailEmergency = ({ emergency, setviewDetailEmergency }:any ) => {

    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [observation, setObservation] = useState('');
    const [mileageOutput, setMileageOutput] = useState(0);
    const [mileageInbound, setMileageInbound] = useState(0);
    const [duration, setDuration] = useState(0);

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    const toast = useRef(null);

    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Estas viendo el detalle de una emergencia registrada en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                <label htmlFor='vehicle' className="mb-2.5 block font-medium text-black dark:text-white">
                  Vehículo
                </label>
                <div className="relative">
                  <Dropdown
                    id="vehicle"
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.value)}
                    placeholder="Selecciona el vehículo para la emergencia"
                    className="w-full"
                  />
                </div>
              </div> 

              <div className="mb-4">
                <label htmlFor='observation' className="mb-2.5 block font-medium text-black dark:text-white">
                  Observación
                </label>
                <div className="relative">
                  <input
                    id='observation'
                    type="text"
                    placeholder="Observación de la emergencia"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ observation }
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='mileageOutput' className="mb-2.5 block font-medium text-black dark:text-white">
                  Kilometraje de salida
                </label>
                <div className="relative">
                  <input
                    id='mileageOutput'
                    type="number"
                    placeholder="Ingrese el kilometraje de salida de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ mileageOutput }
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='mileageInBound' className="mb-2.5 block font-medium text-black dark:text-white">
                  Kilometraje de entrada
                </label>
                <div className="relative">
                  <input
                    id='mileageInBound'
                    type="number"
                    placeholder="Ingrese el kilometraje de entrada de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ mileageInbound }
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='duration' className="mb-2.5 block font-medium text-black dark:text-white">
                  Duración de la emergencia
                </label>
                <div className="relative">
                  <input
                    id='duration'
                    type="number"
                    placeholder="Ingrese la duración de la emergencia"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ duration }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewDetailEmergency