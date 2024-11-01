import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { InputTextarea } from "primereact/inputtextarea"

const ViewSupplyType = ({ supplyType }:any) => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  
  const toast = useRef(null);

  useEffect(() => {
    if(supplyType) {
      setName(supplyType.name);
      setDescription(supplyType.description);
    }
  }, []);
  
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className='w-full border-stroke dark:border-strokedark'>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
             Estas viendo la información del tipo de insumo <span className='text-red-500'>BomberApp</span>
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
                    placeholder="Ingresa el tipo de equipo"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ name }
                    disabled
                  />
                </div>
              </div>              

              <div className="mb-4">
                <label htmlFor='description' className="mb-2.5 block font-medium text-black dark:text-white">
                  Descrpción
                </label>
                <div className="relative">
                  <InputTextarea readOnly required value={ description } onChange={(e) => setDescription(e.target.value)} rows={9} cols={30} maxLength={200} autoResize className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-nonedark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-lg" disabled />
                </div>
              </div>              
            </form>
          </div>
        </div>
      </div>
    </div>   
  )
}

export default ViewSupplyType