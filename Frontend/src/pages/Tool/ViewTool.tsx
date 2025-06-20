import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { handleErrorResponse } from "../../helpers/functions"
import { Toast } from "primereact/toast"

const ViewTool = ({ Idtool }:any) => {

  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [errorMessages, setErrorMessages] = useState<string>('');
  const [serialNumber, setSerialNumber] = useState('')
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedToolType, setSelectedToolType] = useState(null);
  const [selectedOriginTool, setSelectedOriginTool] = useState(null);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState(null);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState(null);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const toast = useRef(null);

  useEffect(() => {
    const getToolById = async () => {
      try {
        const response = await apiRequestAuth.get(`/tool/${Idtool}`, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        setSelectedTool(response.data);
      } catch (error) {
        console.log(error);
        showAlert("error", "Error", handleErrorResponse(error, setErrorMessages));
      }
    };

    getToolById();
  }, [Idtool, currentToken]);

  useEffect(() => {
    if (!selectedTool) return;

    const getToolType = async () => {
      try {
        const response = await apiRequestAuth.get(
          `/tool-type/${selectedTool.toolTypeId}`,
          {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          }
        );
        setSelectedToolType(response.data);
      } catch (error) {
        showAlert("error", "Error", handleErrorResponse(error, setErrorMessages));
      }
    };

    const getOriginTool = async () => {
      try {
        const response = await apiRequestAuth.get(
          `/origin-type/${selectedTool.originTypeId}`,
          {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          }
        );
        setSelectedOriginTool(response.data);
      } catch (error) {
        showAlert("error", "Error", handleErrorResponse(error, setErrorMessages));
      }
    };

    const getEquipmentType = async () => {
      try {
        const response = await apiRequestAuth.get(
          `/equipment-type/${selectedTool.equipmentTypeId}`,
          {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          }
        );
        setSelectedEquipmentType(response.data);
      } catch (error) {
        showAlert("error", "Error", handleErrorResponse(error, setErrorMessages));
      }
    };

    const getEmergencyType = async () => {
      try {
        const response = await apiRequestAuth.get(
          `/emergency-type/${selectedTool.emergencyTypeId}`,
          {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          }
        );
        setSelectedEmergencyType(response.data);
      } catch (error) {
        showAlert("error", "Error", handleErrorResponse(error, setErrorMessages));
      }
    };

    const setToolData = () => {
      setName(selectedTool.name);
      setBrand(selectedTool.brand);
      setModel(selectedTool.model);
      setSerialNumber(selectedTool.serialNumber);
    };

    getToolType();
    getOriginTool();
    getEquipmentType();
    getEmergencyType();
    setToolData();
  }, [selectedTool, currentToken]);

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
      <Toast ref={toast} />
        <div className="flex flex-wrap items-center">            
          <div className='w-full border-stroke dark:border-strokedark'>
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                Estas viendo la información de la herramienta <span className='text-red-500'>BomberApp</span>
              </h2>
              <form>
                <div className="mb-4">
                  <label htmlFor='name' className="mb-2.5 block font-medium text-black dark:text-white">
                    Nombre
                  </label>
                  <div className="relative">
                    <input
                      id='name'
                      type="text"
                      placeholder="Ingresa el nombre de la herramienta"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ name }    
                      disabled                  
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor='brand' className="mb-2.5 block font-medium text-black dark:text-white">
                    Marca
                  </label>
                  <div className="relative">
                    <input
                      id='brand'
                      type="text"
                      placeholder="Ingresa la marca de la herramienta"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ brand }    
                      disabled                  
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor='model' className="mb-2.5 block font-medium text-black dark:text-white">
                    Modelo
                  </label>
                  <div className="relative">
                    <input
                      id='model'
                      type="text"
                      placeholder="Ingresa el modelo de la herramienta"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ model }   
                      disabled                   
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor='serialNumber' className="mb-2.5 block font-medium text-black dark:text-white">
                    Número de serie
                  </label>
                  <div className="relative">
                    <input
                      id='serialNumber'
                      type="text"
                      placeholder="Ingresa el número de serie de la herramienta"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ serialNumber }
                      disabled                 
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Tipo de herramienta
                  </label>
                  <div className="relative">
                  <input
                    value={selectedToolType?.name}
                    placeholder="Seleccione un tipo de herramienta"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  </div>
                </div> 

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Origen de la herramienta
                  </label>
                  <div className="relative">
                  <input
                    value={selectedOriginTool?.name}
                    placeholder="Seleccione el origen de la herramienta"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  </div>
                </div> 

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Tipo de Equipo
                  </label>
                  <div className="relative">
                    <input
                      value={selectedEquipmentType?.name}
                      placeholder="Seleccione el tipo de equipo de la herramienta"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>  

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Tipo de emergencia
                  </label>
                  <div className="relative">
                    <input
                      value={selectedEmergencyType?.name}
                      placeholder="Seleccione el tipo de emergencia para la herramienta"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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

export default ViewTool