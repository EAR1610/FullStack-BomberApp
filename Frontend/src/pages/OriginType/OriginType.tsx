import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { createLog, handleErrorResponse } from "../../helpers/functions"
import { ConnectionStatus, useInternetConnectionStatus } from "../../hooks/useInternetConnectionStatus"

const OriginType = ({ originType, setVisible, isChangedOriginType, setIsChangedOriginType }: any) => {

  const [name, setName] = useState('');
  const [status, setStatus] = useState('active')
  const [error, setError] = useState("");

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const userId = currentToken?.user?.id || 1;
  const [errorMessages, setErrorMessages] = useState<string>('');
  const connectionStatus = useInternetConnectionStatus();
  
  const toast = useRef(null);

  useEffect(() => {
    if(originType) {
      setName(originType.name);
      setStatus(originType.status);
    }
  }, []);

  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement>  ) => {
    e.preventDefault();

    if (connectionStatus === ConnectionStatus.Offline) {
      showAlert("error", "No tienes conexión a internet. Revisa tu conexión.", "Error");
      return;
    }

    setError("");
    const formData = new FormData();

    if( !name ){
      setError("Todos los campos son obligatorios");
      return;
    } else {
      formData.append('name', name);
      formData.append('status', status);
    }

    try {
      if (originType) {
        await apiRequestAuth.put(`/origin-type/${originType.id}`, formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        showAlert('info', 'Info', 'Tipo de Origen Actualizado!');        
      } else {
        await apiRequestAuth.post(`/origin-type`, formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        showAlert('info', 'Info', 'Se ha creado un nuevo tipo de origen!');
      } 

      await createLog(userId, 'ACTUALIZAR', 'TIPO DE ORIGEN', `Se ha ${originType ? 'actualizado' : 'creado'} el registro del tipo de origen: ${name}`, currentToken?.token);
      setIsChangedOriginType(!isChangedOriginType);
      setTimeout(() => {
        setVisible(false);
      }, 1500);
    } catch (error) {
      showAlert('error', 'Error', handleErrorResponse(error, setErrorMessages));
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
              Crea el registro de orígenes en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
              <div className="mb-4">
                <label htmlFor='name' className="mb-2.5 block font-medium text-black dark:text-white">
                  Nombre
                </label>
                <div className="relative">
                  <input
                    id='name'
                    type="text"
                    placeholder="Ingresa el nombre de orígen"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ name }
                    onChange={ e => setName( e.target.value ) }
                  />
                </div>
              </div>               

              <div className="mb-5">
                <input
                  type="submit"
                  value={`${ originType ? 'Actualizar registro' : 'Crear registro'}`}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
              { error && <span>{ error }</span> }

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OriginType