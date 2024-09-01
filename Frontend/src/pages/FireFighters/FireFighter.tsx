import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import { TableFirefightersProps, User } from "../../helpers/Interfaces"
import { handleErrorResponse } from "../../helpers/functions"

const FireFighter: React.FC<TableFirefightersProps> = ({ firefighter, setVisible} ) => {

  const [shiftPreference, setShiftPreference] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState("active");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShiftPreference, setSelectedShiftPreference] = useState(null);
  const [shiftPreferences, setShiftPreferences] = useState([
    { name: "Par", code: "Par" },
    { name: "Impar", code: "Impar" },
  ]);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await apiRequestAuth.get(`/${firefighter.userId}`, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
        if (response) setSelectedUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    const getFirefighter = async () => {      
      if (firefighter) {
        setShiftPreference(firefighter.shiftPreference);
        setSelectedShiftPreference(
          shiftPreferences.find(option => option.code === firefighter.shiftPreference)
        );
        setUsername(firefighter.user.username);
        setFullName(firefighter.user.fullName);
        setEmail(firefighter.user.email);
        setAddress(firefighter.user.address);
        setStatus(firefighter.user.status);
      }
    }

    getUser();
    getFirefighter();
  }, []);

  // const handleErrorResponse = (error: any) => {
  //   if (error.response && error.response.data && error.response.data.errors) {
  //     const errorMessages = error.response.data.errors
  //       .map((err: { message: string }) => err.message)
  //       .join(', ');
  
  //     showAlert('error', 'Error', errorMessages);
  //   } else {
  //     showAlert('error', 'Error', 'Ocurrió un error inesperado');
  //   }
  // };

  /**
   * Handles the form submission event.
   *
   * This function is called when the form is submitted. It prevents the default form submission behavior,
   * checks if all required fields are filled, and then sends a request to the server to update or create a firefighter.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @return {Promise<void>} A promise that resolves when the request is completed.
   */
  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement>  ) => {
    e.preventDefault();
    const formData = new FormData();

    if( 
      !shiftPreference || !username || !email || !address ||  selectedUser === null 
    ) {
      setError("Todos los campos son obligatorios");
      return;
    } else {
      formData.append('shiftPreference', selectedShiftPreference?.code);
      formData.append('userId', JSON.stringify(selectedUser?.id));
      formData.append('status', status);
    }

    try {
      if ( firefighter ) {
        await apiRequestAuth.put(`/firefighter/${firefighter.id}`, formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });

        const formDataUser = new FormData();
        formDataUser.append('username', username);
        formDataUser.append('fullName', fullName);
        formDataUser.append('email', selectedUser.email);
        formDataUser.append('photography', selectedUser.photography || '');
        formDataUser.append('password', selectedUser.password);
        formDataUser.append('address', address);
        formDataUser.append('roleId', JSON.stringify(selectedUser.roleId));
        formDataUser.append('status', selectedUser.status);

        await apiRequestAuth.put(`/${selectedUser.id}`, formDataUser, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        })
      } else {        
        await apiRequestAuth.post(`/firefighter`, formData, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        });
      }
      showAlert('info', 'Info', 'Proceso completado!');
      setTimeout(() => {
        setVisible(false);        
      }, 1500);
    } catch (error) {
      const err = handleErrorResponse(error);
      showAlert('error', 'Error', err);
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
              Crea el registro de bomberos en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
              <div className="mb-4">
                <label htmlFor='shiftPreference' className="mb-2.5 block font-medium text-black dark:text-white">
                  Turno
                </label>
                <Dropdown value={selectedShiftPreference} onChange={(e) => setSelectedShiftPreference(e.value)} options={shiftPreferences} optionLabel="name"
                placeholder="Selecciona el turno" className="w-full md:w-14rem" required/>
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
                    onChange={ e => setUsername( e.target.value ) }
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
                    onChange={ e => setFullName( e.target.value ) }
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
                    placeholder="Ingresa la dirección del bombero"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={ address }
                    onChange={ e => setAddress( e.target.value ) }
                  />
                </div>
              </div>             

              <div className="mb-5">
                <input
                  type="submit"
                  value={`${ firefighter ? 'Actualizar registro' : 'Crear registro'}`}
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

export default FireFighter