import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { handleErrorResponse } from "../../helpers/functions"
// import { useToast } from "../../helpers/showAlert"

const ToolType = ({ toolType, setVisible }: any) => {

  const [name, setName] = useState('');
  const [status, setStatus] = useState('active')

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  
  const toast = useRef(null);

  useEffect(() => {
    if(toolType) {
      setName(toolType.name)
      setStatus(toolType.status)
    }
  }, []);  

  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement>  ) => {
    e.preventDefault();
    const formData = new FormData();

    if( !name ){
      showAlert("warn", "Atención", "Todos los campos son obligatorios");
      return;
    } else {
      formData.append('name', name.trim());
      formData.append('status', status);
    }

    try {
      if (toolType) {
        await apiRequestAuth.put(`/tool-type/${toolType.id}`, formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        showAlert('info', 'Info', 'Registro Actualizado!');
      } else {
        await apiRequestAuth.post(`/tool-type`, formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        showAlert('info', 'Info', 'Registro Creado!');
      }
      setTimeout(() => {
        setVisible(false);
      }, 1500);
    } catch (error) {
      handleErrorResponse(error);
    }
  }

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  // const GlobalToast = () => <ToastComponent />;

  return (
    <>
    {/* <GlobalToast /> */}
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Crea el registro del tipo de herramientas en <span className='text-red-500'>BomberApp</span>
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
                    placeholder="Ingresa el nombre del tipo de herramienta"
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
                  value={`${ toolType ? 'Actualizar registro' : 'Crear registro'}`}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
              { error && <span>{ error }</span> }
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ToolType