import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { TableFirefightersProps } from "../../helpers/Interfaces"
import { InputTextarea } from "primereact/inputtextarea"

const ViewFireFighter: React.FC<TableFirefightersProps> = ({ firefighter, setVisible} ) => {

  const [shiftPreference, setShiftPreference] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [dpi, setDpi] = useState('');

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null);

  useEffect(() => {
   const getFirefighter = async () => {
      if (firefighter) {
        setShiftPreference(firefighter.shiftPreference);
        setUsername(firefighter.user.username);
        setFullName(firefighter.user.fullName);
        setAddress(firefighter.user.address);
        setDpi(firefighter.user.dpi);
      }
    }

    getFirefighter();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Vé el registro de bomberos en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form>
              <div className="mb-4">
                <label htmlFor='shiftPreference' className="mb-2.5 block font-medium text-black dark:text-white">
                  Turno
                </label>
                <input
                    id='shiftPreference'
                    type="text"
                    placeholder="Seleccione el turno del usuario del bombero"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ shiftPreference }
                    disabled                    
                  />
              </div>

              <div className="mb-4 bg-blue-800 p-1 rounded-lg">
                <label htmlFor='username' className="block text-2xl text-white text-center">
                    Datos del usuario
                </label>
              </div>

              <div className="mb-4">
                <label htmlFor='username' className="mb-2.5 block font-medium text-black dark:text-white">
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <input
                    id='username'
                    type="text"
                    placeholder="Ingresa el nombre del usuario del bombero"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ username }
                    disabled                    
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='fullName' className="mb-2.5 block font-medium text-black dark:text-white">
                  Nombre completo
                </label>
                <div className="relative">
                  <input
                    id='fullName'
                    type="text"
                    placeholder="Ingresa el nombre del usuario del bombero"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ fullName }
                    disabled                    
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='dpi' className="mb-2.5 block font-medium text-black dark:text-white">
                  DPI
                </label>
                <div className="relative">
                  <input
                    id='dpi'
                    type="text"
                    placeholder="Ingresa el DPI del bombero"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ dpi }
                    disabled                    
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor='address' className="mb-2.5 block font-medium text-black dark:text-white">
                  Dirección
                </label>
                <div className="relative">
                <InputTextarea required readOnly value={ address } onChange={(e) => setAddress(e.target.value)} rows={5} cols={30} maxLength={200} autoResize className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-nonedark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-lg" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewFireFighter