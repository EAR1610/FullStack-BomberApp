import { useContext, useEffect, useRef, useState } from "react";
import { apiRequestAuth } from "../../lib/apiRequest";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { Toast } from "primereact/toast";
import { Editor } from 'primereact/editor';
        

const DetailEmergency = ( { idEmergency, setViewDetailEmergency, statusEmergency }: any ) => {
    const [observation, setObservation] = useState('');
    const [duration, setDuration] = useState(0);
    const [isUpdated, setIsUpdated] = useState(false);

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;

    const toast = useRef(null);

    useEffect(() => {
        const getDetailEmergency = async () => {
            const response = await apiRequestAuth.get(`detail-emergency/${idEmergency}`, {
                headers: {
                    Authorization: `Bearer ${currentToken?.token}`
                }
            });
            setObservation(response.data[0].observation);
            setDuration(response.data[0].duration);
            if( response.data[0].duration > 0 ) setIsUpdated(true);
        }

        getDetailEmergency();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if( !observation || duration === 0 ) {
            showAlert('warn', 'Atención', 'Todos los campos son obligatorios');
            return;
        }

        const formData = new FormData();
        formData.append('emergencyId', String(idEmergency));
        formData.append('observation', observation);
        formData.append('duration', String(duration));

        try {

          if( !isUpdated ){
            await apiRequestAuth.post(`detail-emergency/`, formData, {
                headers: {
                    Authorization: `Bearer ${currentToken?.token}`
                }
            })
            showAlert('success', 'Exito', 'Se ha establecido la emergencia'); 

          } else {
            await apiRequestAuth.put(`detail-emergency/${idEmergency}`, formData, {
                headers: {
                    Authorization: `Bearer ${currentToken?.token}`
                }
            })
            showAlert('success', 'Exito', 'Se ha actualizado la emergencia');

          }
            setTimeout(() => {
                setViewDetailEmergency(false);
            }, 1500);

        } catch (error) {
            console.log(error);
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
                  Estas viendo el detalle de una emergencia registrada en <span className='text-red-500'>BomberApp</span>
                </h2>
                <form onSubmit={ handleSubmit }>
                  <div className="mb-4">
                    <label htmlFor='applicant' className="mb-2.5 block font-medium text-black dark:text-white">
                      Observación
                    </label>
                    <div className="relative">
                        <Editor value={observation} onTextChange={(e) => setObservation(e.htmlValue)} style={{ height: '320px' }} />
                    </div>
                  </div>   

                  <div className="mb-4">
                    <label htmlFor='vehicle_number' className="mb-2.5 block font-medium text-black dark:text-white">
                      Duración en minutos
                    </label>
                    <div className="relative">
                      <input
                        id='vehicle_number'
                        type="number"
                        min={0}
                        placeholder="Ingresa el tiempo de la emergencia"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                        value={ duration }
                        onChange={ e => setDuration( parseInt(e.target.value )) }
                      />
                    </div>
                  </div>
                  <div className="mb-5 mt-5">
                    <input
                      type="submit"
                      value={ 
                        statusEmergency === 'Atendida' 
                        ? 'Emergencia Atendida' 
                        : isUpdated
                            ? 'Actualizar Emergencia'
                            : 'Registrar Emergencia'
                      }
                      disabled={ statusEmergency === 'Atendida' }
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 uppercase"
                    />
                  </div>                                        
                </form>
              </div>
            </div>
          </div>
    </div>
    )
}

export default DetailEmergency