import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo  from '../../assets/Logo.png';
import { apiRequest } from '../../lib/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import { AuthContextProps } from '../../interface/Auth';
import { Toast } from 'primereact/toast';
import { ConnectionStatus, useInternetConnectionStatus } from '../../hooks/useInternetConnectionStatus';
        

/**
 * ? Renders the sign-in page with a form for the user to enter their email and password.
 *
 * @return {JSX.Element} The sign-in page with a form for the user to enter their email and password.
 */

const SignIn: React.FC = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const connectionStatus = useInternetConnectionStatus();
  const [showPassword, setShowPassword] = useState(false);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken, updateToken } = authContext;
  const navigate = useNavigate();

  const toast = useRef(null);

  useEffect(() => {
    const verificarToken = async () => {
      if( currentToken) {
        if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
        if( currentToken?.user.isUser ) navigate('/app/emergency-request');
        if( currentToken?.user.isAdmin ) navigate('/app/dashboard');
      }
    }
    verificarToken();
  }, []);
  

  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    if (connectionStatus === ConnectionStatus.Offline) {
      showAlert("error", "No tienes conexión a internet. Revisa tu conexión.", "Error");
      return;
    }
    
    try {
      const res = await apiRequest.post("/login", {
        email,
        password,
      });
      showAlert("info", "Inicio de sesión exitosa", "Success");
      
      updateToken(res.data);
      setTimeout(() => {
        if ( res.data.user.isAdmin ) {
          navigate("/app/dashboard");          
        } else if ( res.data.user.isFirefighter ) {
          navigate("/app/firefighter-shift");
        } else {
          navigate("/app/emergency-request");
        }
      }, 1000);
      
    } catch (err: any) {
      if (err.response && err.response.status === 401 && err.response.data.error === 'Tu cuenta no está activa.') {
        showAlert("error", "Tu cuenta no está activa.", "Error");
      } else if (err.response && err.response.status === 401 && err.response.data.error === 'Tu cuenta está suspendida por demasiadas penalizaciones.') {
        showAlert("error", "Tu cuenta está suspendida por demasiadas penalizaciones.", "Error");
      } else {
        showAlert("error", "Credenciales incorrectas", "Error");
      }
    }
  };

  /**
   * ? Displays an alert with the specified type and message using the provided toast component.
   *
   * @param {string} type - The type of alert to display (e.g. "info", "error").
   * @param {string} message - The message to display in the alert.
   * @return {void} This function does not return anything.
   */
  const showAlert = ( type:string, message:string, summary: string ) => toast.current.show({ severity: type, summary: summary, detail: message, life: 3000 });

  return (
    <>
      <Toast ref={toast} />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full lg:block lg:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <p className="2xl:px-20 dark:text-white">
                Inicia sesión en BomberApp para disfrutar de los beneficios que te ofrece.
              </p>

              <span className="mt-5 inline-block">
                <img src={Logo} alt="Logo" />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark lg:w-1/2 lg:border-l-2">
            <div className="w-full p-4 sm:p-12.5 lg:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Inicia sesión en <span className='text-red-500'>BomberApp</span>
              </h2>
              <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Introduce tu correo"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ email }
                      onChange={ e => setEmail(e.target.value)}
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Escribe tu contraseña"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <span className="absolute right-4 top-4">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-900"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                            <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                          </svg>
                        ) : (
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="m4 15.6 3.055-3.056A4.913 4.913 0 0 1 7 12.012a5.006 5.006 0 0 1 5-5c.178.009.356.027.532.054l1.744-1.744A8.973 8.973 0 0 0 12 5.012c-5.388 0-10 5.336-10 7A6.49 6.49 0 0 0 4 15.6Z"/>
                            <path d="m14.7 10.726 4.995-5.007A.998.998 0 0 0 18.99 4a1 1 0 0 0-.71.305l-4.995 5.007a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.402.211.59l-4.995 4.983a1 1 0 1 0 1.414 1.414l4.995-4.983c.189.091.386.162.59.211.011 0 .021.007.033.01a2.982 2.982 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z"/>
                            <path d="m19.821 8.605-2.857 2.857a4.952 4.952 0 0 1-5.514 5.514l-1.785 1.785c.767.166 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z"/>
                          </svg>
                        )}
                      </button>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Iniciar sesión"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>               
                <div className="mt-6 text-center">
                  <p>
                   No tienes una cuenta?{' '}
                    <Link to="/register" className="text-primary">
                      Crea una cuenta
                    </Link>
                  </p>                  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
