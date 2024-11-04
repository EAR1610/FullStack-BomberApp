import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import MapComponent from "../../components/Maps/MapComponent"
import { useNavigate } from "react-router-dom"
import { createLog, handleErrorResponse } from "../../helpers/functions"
import { InputTextarea } from "primereact/inputtextarea"
import { ConnectionStatus, useInternetConnectionStatus } from "../../hooks/useInternetConnectionStatus"

const EmergencyRequestByAdmin = () => {
    const [emergenciesType, setEmergenciesType] = useState([]);
    const [selectedEmergencyType, setSelectedEmergencyType] = useState(null);
    const [applicant, setApplicant] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState(16.925213065550683);
    const [longitude, setLongitude] = useState(-89.90177602186692);

    const [description, setDescription] = useState("");
    const [status, setStatus] = useState('Registrada');

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken, updateToken } = authContext;
    const userId = currentToken?.user?.id || 1;
    const [errorMessages, setErrorMessages] = useState<string>('');
    const connectionStatus = useInternetConnectionStatus();

    const navigate = useNavigate();
    const toast = useRef(null);

    useEffect(() => {
        try {
            const getEmergenciesType = async () => {
                const response = await apiRequestAuth.get("/emergency-type", {
                    headers: {
                        Authorization: `Bearer ${currentToken?.token}`
                    }
                });

                if (!response) throw new Error('Error al obtener los tipos de emergencia');                
                setEmergenciesType(response.data);
            }   
            getEmergenciesType();            
        } catch (err) {
            if(err.response.data.errors[0].message=== 'Unauthorized access'){
                showAlert("error", "Sesion expirada", "Vuelve a iniciar sesion");
                setTimeout(() => {
                    navigate('/login', { replace: true });
                    updateToken('' as any);
                }, 1500);
            } else {
                showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
            }          
        }
    }, []);

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        if (connectionStatus === ConnectionStatus.Offline) {
            showAlert("error", "No tienes conexión a internet. Revisa tu conexión.", "Error");
            return;
        }

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
          await createLog(userId, 'CREAR', 'EMERGENCIA', `Se ha registrado la emergencia: ${applicant} con la descripción: ${description} por parte del ADMINISTRADOR`, currentToken?.token);
          showAlert('info', 'Info', '¡Emergencia registrada correctamente!');

          setTimeout(() => {
            navigate('/app/emergencies');
          }, 1000);
        } catch (error) {
          console.log(error);
          showAlert('error', 'Error', handleErrorResponse(error, setErrorMessages));
        }        
      };

      const handleLocationChange = (lat: number, lng: number) => {
        setLatitude(lat);
        setLongitude(lng);
      };
    
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
                                    filter
                                    required
                                    />
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-between">
                                    <div className="mb-4 w-full md:w-1/2">
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

                                    <div className="mb-4 w-full md:w-1/2">
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
                                </div>               

                                <div className="mb-4 ">

                                    <label htmlFor='description' className="mb-2.5 block font-medium text-black dark:text-white">
                                    Descripción
                                    </label>

                                    <div className="relative mb-2">                                        
                                        <InputTextarea value={ description } onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}  rows={5} cols={30} maxLength={500} autoResize className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-nonedark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-lg" />
                                    </div>

                                    <MapComponent latitude={16.925213065550683} longitude={-89.90177602186692} onLocationChange={handleLocationChange} />                                    
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
        </>
    )
}

export default EmergencyRequestByAdmin