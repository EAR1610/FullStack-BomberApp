import{ useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import MapComponent from "../../components/Maps/MapComponent"

const ViewEmergency = ({ emergency }: any) => {

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    
    const toast = useRef(null);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Estas viendo una emergencia registrada en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form>
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
                <label htmlFor='status' className="mb-2.5 block font-medium text-black dark:text-white">
                  Estado
                </label>
                <div className="relative">
                  <input
                    id='status'
                    type="text"
                    placeholder="Ingresa el tipo de gasolina de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ emergency?.status }
                    disabled                    
                  />
                </div>
              </div>

              <MapComponent latitude={emergency.latitude} longitude={emergency.longitude} />

              {/* <div className="mb-4">
                <label htmlFor='vehicle_number' className="mb-2.5 block font-medium text-black dark:text-white">
                  No. Vehículo
                </label>
                <div className="relative">
                  <input
                    id='vehicle_number'
                    type="number"
                    min={0}
                    placeholder="Ingresa el número de vehículo de la unidad"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ vehicleNumber }
                    disabled                    
                  />
                </div>
              </div>*/}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewEmergency