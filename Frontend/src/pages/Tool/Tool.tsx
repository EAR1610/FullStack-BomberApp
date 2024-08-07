import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"

const Tool = ({ tool, setVisible}:any) => {

    const [name, setName] = useState('')
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [serialNumber, setSerialNumber] = useState('')
    const [dateOfPurchase, setDateOfPurchase] = useState('')
    const [status, setStatus] = useState('active')
    const [error, setError] = useState("");

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  
  const toast = useRef(null);

  useEffect(() => {
    const formattedDate = getFormattedDate();
    setDateOfPurchase(formattedDate);
    if(tool){
      setName(tool.name)
      setBrand(tool.brand)
      setModel(tool.model)
      setSerialNumber(tool.serialNumber)
      setStatus(tool.status)
    }
  }, [tool])
  

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

    const handleSubmit = async ( e:React.FormEvent<HTMLFormElement> ) => { 
        debugger;   
        e.preventDefault();    
        setError("");
        
        const formData = new FormData();
    
        if(tool){
    
          if ( 
            !name || !brand || !model  || !serialNumber || !dateOfPurchase
          ) {
            setError("Todos los campos son obligatorios.");
            return;
    
          } else {        
            formData.append('name', name);
            formData.append('brand', brand);
            formData.append('model', model);
            formData.append('serialNumber', serialNumber);
            formData.append('dateOfPurchase', dateOfPurchase);
            formData.append('toolTypeId', JSON.stringify(1));
            formData.append('originTypeId', JSON.stringify(1));
            formData.append('equipmentTypeId', JSON.stringify(1));
            if (status) formData.append('status', status);
          } 
    
        } else{
    
          if ( 
            !name || !brand || !model  || !serialNumber
          ) {
            setError("Todos los campos son obligatorios.");
            return;
          } else {
            formData.append('name', name);
            formData.append('brand', brand);
            formData.append('model', model);
            formData.append('serialNumber', serialNumber);
            formData.append('dateOfPurchase', dateOfPurchase);
            formData.append('status', status);
            formData.append('toolTypeId', JSON.stringify(1));
            formData.append('originTypeId', JSON.stringify(1));
            formData.append('equipmentTypeId', JSON.stringify(1));
          }
    
        }  
    
        try {
    
          if (tool) {
            await apiRequestAuth.put(`/tool/${tool.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${currentToken?.token}`
            },
        });
        setVisible(false);        
        
    } else {
        const res =await apiRequestAuth.post("/tool", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${currentToken?.token}`
              },
            });
            showAlert('info', 'Info', 'Herramienta Creado!');
          }
          
        } catch (err:any) {
          setError(err.response.data.message);
        }
      };

      const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });
    
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
      <Toast ref={toast} />
        <div className="flex flex-wrap items-center">            
          <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                Crea una herramienta en <span className='text-red-500'>BomberApp</span>
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
                      placeholder="Ingresa el nombre de la herramienta"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ name }
                      onChange={ e => setName( e.target.value ) }
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
                      onChange={ e => setBrand( e.target.value ) }
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
                      onChange={ e => setModel( e.target.value )}
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
                      onChange={ e => setSerialNumber( e.target.value ) }
                    />
                  </div>
                </div>               

                <div className="mb-5">
                  <input
                    type="submit"
                    value={`${ tool ? 'Actualizar Herramienta' : 'Crear herramienta'}`}
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

export default Tool