import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import { Emergency } from "../../helpers/Interfaces"
import ModalLocalitationEmergency from "./ModalLocalitationEmergency"
import { useNavigate } from "react-router-dom"

const EmergencyRequest: React.FC<Emergency> = () => {
    const [emergenciesType, setEmergenciesType] = useState([]);
    const [selectedEmergencyType, setSelectedEmergencyType] = useState(null);
    const [applicant, setApplicant] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [description, setDescription] = useState("");
    const [status, setstatus] = useState('Registrada');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;

    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getEmergenciesType = async () => {
            try {
                const response = await apiRequestAuth.get("/emergency-type", {
                    headers: {
                        Authorization: `Bearer ${currentToken?.token}`
                    }
                });
                if (response) setEmergenciesType(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        getEmergenciesType();
    }, []);  
    
    const handleConfirm = () => {
        setIsModalOpen(false);
      
        if (navigator.geolocation) {
          const watchId = navigator.geolocation.watchPosition(async (position) => {
              console.log(position);
              const { latitude, longitude } = position.coords;
              console.log("Latitude:", latitude, "Longitude:", longitude);
              setLatitude(latitude);
              setLongitude(longitude);
        
              const formData = new FormData();
              formData.append('emergencyTypeId', String(selectedEmergencyType?.id));
              formData.append('applicant', applicant);
              formData.append('address', address);
              formData.append('latitude', String(latitude));
              formData.append('longitude', String(longitude));
              formData.append('description', description);
              formData.append('status', status);
              formData.append('userId', String(currentToken?.user.id));
        
              try {
                await apiRequestAuth.post("/emergencies", formData, {
                  headers: {
                    Authorization: `Bearer ${currentToken?.token}`,
                  },
                });
                showAlert('info', 'Info', '¡Emergencia registrada correctamente!');
              } catch (error) {
                console.log(error);
              }
        
              navigator.geolocation.clearWatch(watchId);
              if( currentToken?.user.id ){
                setTimeout(() => {
                  navigate('/app/my-emergencies');
                }, 1500);
              }
            }, (error) => {
              console.error("Error obteniendo la ubicación:", error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      };
      

    const handleSubmit = async ( e:React.FormEvent<HTMLFormElement>  ) => {
        e.preventDefault();
        setIsModalOpen(true);       
    }
    
    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });
    
    return (
    <>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
        <Toast ref={toast} />
        <div className="flex flex-wrap items-center">            
            <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                Solicita una emergencia en <span className='text-red-500'>BomberApp</span>
                </h2>
                <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Tipo de emergencia
                    </label>
                    <div className="relative">
                    <Dropdown
                      value={ selectedEmergencyType }
                      options={ emergenciesType }
                      onChange={ (e) => setSelectedEmergencyType(e.value) }
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Seleccione el tipo de emergencia"
                      className="w-full"
                      required
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor='applicant' className="mb-2.5 block font-medium text-black dark:text-white">
                    Solicitante
                    </label>
                    <div className="relative">
                    <input
                        id='applicant'
                        type="text"
                        placeholder="Ingresa el nombre del solicitante"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                        value={ applicant }
                        onChange={ e => setApplicant( e.target.value ) }
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
                        placeholder="Ingresa la dirección de la emergencia"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                        value={ address }
                        onChange={ e => setAddress( e.target.value ) }
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
                        placeholder="Ingresa la descripción de la emergencia"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                        value={ description }
                        onChange={ e => setDescription( e.target.value ) }
                    />
                    </div>
                </div>

                <div className="mb-5">
                    <input
                    type="submit"
                    value={`${'Solicitar emergencia'}`}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    />
                </div>
                </form>
            </div>
            </div>
        </div>
        </div>
        <ModalLocalitationEmergency 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onConfirm={handleConfirm} 
        />
    </>
  )
}

export default EmergencyRequest