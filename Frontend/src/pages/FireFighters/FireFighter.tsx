import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import { TableFirefightersProps, User } from "../../helpers/Interfaces"

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

  /**
   * Handles the form submission event.
   *
   * This function is called when the form is submitted. It prevents the default form submission behavior,
   * checks if all required fields are filled, and then sends a request to the server to update or create a firefighter.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @return {Promise<void>} A promise that resolves when the request is completed.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) {
      showAlert("warn", "Atención", "Todos los campos son obligatorios");
      return;
    }
  
    const formData = new FormData();
    formData.append('shiftPreference', selectedShiftPreference?.code);
    formData.append('userId', JSON.stringify(selectedUser?.id));
    formData.append('status', status);
  
    try {
      await apiRequestAuth.put(`/firefighter/${firefighter.id}`, formData, {
        headers: {
          Authorization: `Bearer ${currentToken?.token}`,
        }
      });
      showAlert('info', 'Info', 'Bombero Actualizado!');
      setTimeout(() => {
        setVisible(false);
      }, 1500);
    } catch (error) {
      showAlert('error', 'Error', 'Ha habido un error al actualizar el Bombero');
    }
  }

    const validateForm = () => {
      return (
        shiftPreference &&
        username &&
        email &&
        address &&
        selectedUser !== null
      );
    }
  
  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });  

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
    <Toast ref={toast} />
      <div className="flex flex-wrap items-center">            
        <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
              Actualiza el turno de los bomberos en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
              <div className="mb-4">
                <label htmlFor='shiftPreference' className="mb-2.5 block font-medium text-black dark:text-white">
                  Turno
                </label>
                <Dropdown value={selectedShiftPreference} onChange={(e) => setSelectedShiftPreference(e.value)} options={shiftPreferences} optionLabel="name"
                placeholder="Selecciona el turno" className="w-full md:w-14rem" required/>
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