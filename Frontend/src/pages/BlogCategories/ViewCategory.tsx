import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"

const ViewCategory = ({ category }:any) => {

  const [name, setName] = useState<String>('');
  const [description, setDescription] = useState<String>('');

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  
  const toast = useRef(null);

  useEffect(() => {
    if(category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, []);0

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className='w-full border-stroke dark:border-strokedark'>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
             Estas viendo la información de la categoría <span className='text-red-500'>BomberApp</span>
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
                    placeholder="Ingresa el nombre de la categoría"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ String(name) }
                    disabled
                  />
                </div>
              </div>                                        

              <div className="mb-4">
                <label htmlFor='descripcion' className="mb-2.5 block font-medium text-black dark:text-white">
                  Descripción
                </label>
                <div className="relative">
                  <input
                    id='descripcion'
                    type="text"
                    placeholder="Ingresa la descripción de la categoría"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ String(description) }
                    disabled
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

export default ViewCategory