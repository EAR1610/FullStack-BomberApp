import { useContext, useRef, useState } from "react"
import { Calendar } from 'primereact/calendar';
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from "primereact/toast"
import { TableFirefightersProps } from "../../helpers/Interfaces";

const SetFirefighterShift: React.FC<TableFirefightersProps> = ({ firefighter, setVisible }:any) => {
    const [date, setDate] = useState(null);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('active');

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
  
    const toast = useRef(null);

    const handleErrorResponse = (error: any) => {
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
        showAlert('error', 'Error', errorMessage);
      } else {
        showAlert('error', 'Error', 'Ocurrió un error inesperado');
      }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        debugger;

        if (date === null) {
          setError('Todos los campos son obligatorios');
          return;
        }

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        try {
            const formData = new FormData();
            formData.append('firefighterId', String(firefighter.id));
            formData.append('year', String(year));
            formData.append('month', String(month));
            formData.append('status', String(status));

            await apiRequestAuth.post('/firefighter-shift', formData, {
                headers: {
                    Authorization: `Bearer ${currentToken?.token}`,
                },
            });
            showAlert('info', 'Info', 'Turno registrado correctamente!');
            setTimeout(() => {
              setVisible(false);              
            }, 1500);
        } catch (error) {
            console.log(error);
            console.log(error.response);
            handleErrorResponse(error);
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
              A continuación, seleccionará el turno de un bombero en <span className='text-red-500'>BomberApp</span>
            </h2>
            <form onSubmit={ handleSubmit }>
                <div className="card flex justify-content-center w-full">
                    <Calendar value={date} onChange={(e) => setDate(e.value)} view="month" dateFormat="mm/yy" />
                </div>
                <div className="mt-5">
                    <input
                    type="submit"
                    value={`Establecer turno para ${firefighter.user.fullName}`}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    />
                </div>
                { error && <span className="text-red-500 text-2xl mt-2">{ error }</span> }
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetFirefighterShift