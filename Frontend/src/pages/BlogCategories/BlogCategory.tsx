import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { createLog, handleErrorResponse } from "../../helpers/functions"
import { InputTextarea } from "primereact/inputtextarea"
import { ConnectionStatus, useInternetConnectionStatus } from "../../hooks/useInternetConnectionStatus"

const BlogCategory = ({ category, setVisible, isChangedCategory, setIsChangedCategory }: any) => {

    const [name, setName] = useState<String>('');
    const [description, setDescription] = useState<String>('');
    const [status, setStatus] = useState<String>('active')

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    const userId = currentToken?.user?.id || 1;
    const [errorMessages, setErrorMessages] = useState<string>('');
    const connectionStatus = useInternetConnectionStatus();

    const toast = useRef(null);

    useEffect(() => {
      const getBlogCategory = async () => {
        if(category){
          setName(category.name);
          setDescription(category.description);
          setStatus(category.status);
        }
      }
      getBlogCategory();
    }, []);

    const handleSubmit = async ( e:React.FormEvent<HTMLFormElement>  ) => {
        e.preventDefault();
        const formData = new FormData();

        if (connectionStatus === ConnectionStatus.Offline) {
          showAlert("error", "No tienes conexión a internet. Revisa tu conexión.", "Error");
          return;
        }
    
        if( !name || !description ){
          showAlert('warn', 'Error', "Todos los campos son obligatorios");
          return;
        } else {
          formData.append('name', String(name));
          formData.append('description', String(description));
          formData.append('status', String(status));
        }
    
        try {
          if (category) {
            await apiRequestAuth.put(`/blog/categories/${category.id}`, formData, {
              headers: {
                Authorization: `Bearer ${currentToken?.token}`,
              },
            });
            showAlert('info', 'Info', 'Registro actualizado!');
          } else {
            await apiRequestAuth.post(`/blog/categories`, formData, {
              headers: {
                Authorization: `Bearer ${currentToken?.token}`,
              },
            });
            showAlert('info', 'Info', 'Registro creado!');
          }

          await createLog(userId, `${category ? 'ACTUALIZAR' : 'CREAR'}`, 'CATEGORIA BLOG', `Se ha ${category ? 'actualizado' : 'creado'} la categoría: ${name}`, currentToken?.token);
          setIsChangedCategory(!isChangedCategory);
          
          setTimeout(() => {
            setVisible(false);
          }, 1000);
        } catch (err) {
          showAlert('warn', 'Error', handleErrorResponse(err, setErrorMessages));
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
                Crea el registro de categorias en <span className='text-red-500'>BomberApp</span>
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
                      placeholder="Ingresa el nombre de tipo de categoria para el blog"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ String(name) }
                      onChange={ e => setName( e.target.value ) }
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor='description' className="mb-2.5 block font-medium text-black dark:text-white">
                    Descripción
                  </label>
                  <div className="relative">
                    <InputTextarea required value={ String(description) } onChange={(e) => setDescription(e.target.value)} rows={5} cols={30} maxLength={200} autoResize className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-nonedark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-lg" />
                  </div>
                </div>
                <div className="mb-5">
                  <input
                    type="submit"
                    value={`${ category ? 'Actualizar registro' : 'Crear registro'}`}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
    </div>
  )
}

export default BlogCategory