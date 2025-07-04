import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo  from '../../assets/Logo.png';
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';
import { apiRequest, apiRequestAuth } from '../../lib/apiRequest';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { createLog } from '../../helpers/functions';
import { InputTextarea } from 'primereact/inputtextarea';
import { ConnectionStatus, useInternetConnectionStatus } from '../../hooks/useInternetConnectionStatus';
        
const SignUp: React.FC = ({ user, setVisible, changedAUser, setChangedAUser }:any) => {
  
  const [errorMessages, setErrorMessages] = useState<string>('');
  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const userId = currentToken?.user?.id || 1;
  const navigate = useNavigate();
  
  const toast = useRef(null);
  
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [dpi, setDpi] = useState('');
  const [phone, setPhone] = useState('');
  const [penalizations, setPenalizations] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [photography, setPhotography] = useState<File | null>(null);
  const [status, setStatus] = useState('active');
  const [roleId, setRoleId] = useState(3);
  const [imagePreview, setImagePreview] = useState<null | string>(null);
  const [selectedFirefighter, setSelectedFirefighter] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [selectedShiftPreference, setSelectedShiftPreference] = useState(null);
  const [shiftPreferences, setShiftPreferences] = useState([
    { name: "Par", code: "Par" },
    { name: "Impar", code: "Impar" },
  ]);
  const connectionStatus = useInternetConnectionStatus();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsValidEmail(emailRegex.test(e.target.value));
  };

  const header = <div className="font-bold mb-3">Escribe tu contraseña</div>;
  const footer = (
      <>
          <Divider />
          <p className="mt-2">Sugerencias</p>
          <ul className="pl-2 ml-2 mt-0 line-height-3">
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una letra minúscula</li>
              <li>Al menos una letra mayúscula</li>
              <li>Al menos un número</li>
          </ul>
      </>
    );

    const fetchUserImage = async (photography: string) => {
      try {
        const response = await apiRequestAuth.get(`/profile/${photography}`, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`
          },
          responseType: 'blob'
        });
        const imageBlob = response.data;
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setImagePreview(imageObjectUrl);
      } catch (error) {
        console.error('Error fetching user image:', error);
      }
    };    
  useEffect(() => {    
    if (user) {
      setUsername(user.username || '');
      setFullName(user.fullName || '');
      setDpi(user.dpi || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setPhotography(user.photography || null);
      setPassword(user.password || ''); 
      setAddress(user.address || '');
      setStatus(user.status || status);
      setRoleId(user.roleId || 3);
      fetchUserImage(user.photography);
    }
  }, [user]);

  const roles = [
    { id: 1, name: "Administrador" },
    { id: 2, name: "Bombero" },
    { id: 3, name: "Usuario" }
  ];

  const selectedRoleTemplate = (option:any, props:any) => {
    if (option) {
        return (
            <div className="flex align-items-center">
                <span className="mr-2">{option.name}</span>
            </div>
        );
    }

    return <span>{props.placeholder}</span>;
  };

  const roleOptionTemplate = (option:any) => {
      return (
          <div className="flex align-items-center">
              <span className="mr-2">{option.name}</span>
          </div>
      );
  };

  const handleRoleChange = (e:any) => setRoleId(e.value.id);
  const selectedRole = roles.find(role => role.id === roleId); 
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotography(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }; 
  
  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    const formData = new FormData();

    if (connectionStatus === ConnectionStatus.Offline) {
      showAlert("error", "No tienes conexión a internet. Revisa tu conexión.", "Error");
      return;
    }
  
    if( !isValidEmail ) {
      showAlert('error', 'Error', 'El email ingresado no es válido');
      return;
    }

    if( user ) {

      if ( 
        !username || !fullName || !email  || !address || !dpi || !phone
      ) {
        showAlert('error', 'Error', 'Todos los campos son obligatorios');
        return;

      } else {        
        formData.append('username', username);
        formData.append('fullName', fullName);
        formData.append('dpi', dpi);
        formData.append('phone', phone);
        formData.append('penalizations', JSON.stringify(penalizations));
        formData.append('email', email);
        formData.append('address', address);
        formData.append('roleId', JSON.stringify(roleId));
        formData.append('status', status);
        formData.append('shiftPreference', selectedShiftPreference !== null ? selectedShiftPreference?.name : '');
        if ( typeof(photography) !== "string") formData.append('photography', photography);
      } 

    } else {

      if ( 
        !username || !fullName || !email || 
        !password || !address || !photography || !dpi
      ) {
        showAlert('error', 'Error', 'Todos los campos son obligatorios');
        return;
      } else {
        formData.append('username', username);
        formData.append('fullName', fullName);
        formData.append('dpi', dpi);
        formData.append('phone', phone);
        formData.append('penalizations', JSON.stringify(penalizations));
        formData.append('email', email);
        formData.append('password', password);
        formData.append('address', address);
        formData.append('roleId', JSON.stringify(roleId));
        formData.append('status', status);
        formData.append('shiftPreference', selectedShiftPreference !== null ? selectedShiftPreference?.name : '');
        if (photography) formData.append('photography', photography);
      }
    }  

    try {
      if ( user ) {
        await apiRequestAuth.put(`/${user.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`
          },
        });

        if ( selectedFirefighter && selectedShiftPreference !== null && user.roleId === 2 ) {
          const formData = new FormData();
          formData.append('userId', user.id);
          formData.append('shiftPreference', selectedShiftPreference?.name);

          await apiRequestAuth.put(`/firefighter/${selectedFirefighter.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${currentToken?.token}`
            }
          })
        }

        await createLog(userId, 'ACTUALIZAR', 'USUARIO', `Se ha actualizado la informacion del usuario: ${user.fullName} con dpi: ${dpi}`, currentToken?.token);
        showAlert('info', 'Info', 'Usuario Actualizado!');

      } else {
        await apiRequest.post("/register", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if( !currentToken ){
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
        showAlert('info', 'Info', 'Usuario Creado!');
      }

      if ( user !== undefined ) setChangedAUser(!changedAUser);

      setTimeout(() => {
        setVisible(false);
      }, 1500);
    } catch (err:any) {
      showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  const handleErrorResponse = (error: any, setErrorMessages: (msg: string) => void) => {
    const errorMessages = error?.response?.data?.errors
      ? error.response.data.errors.map((err: { message: string }) => err.message).join(', ')
      : 'Ocurrió un error inesperado, por favor intenta cambiar la imagen.';
  
    setErrorMessages(errorMessages);
  
    return errorMessages;
  };

  const handleDPIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,13}$/.test(value)) setDpi(value);    
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,8}$/.test(value)) setPhone(value);
  };

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (
    <>    
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
      <Toast ref={toast} />
        <div className="flex flex-wrap items-center">          
          <div className={`${currentToken ? 'hidden' : 'hidden w-full lg:block lg:w-1/2'}`}>
            <div className="py-17.5 px-26 text-center">
              <p className="2xl:px-20 dark:text-white">
                Crea una cuenta en BomberApp y empieza a disfrutar de lo que puedes aprender o ayudar
              </p>            
            
              <span className="mt-5 inline-block">
              <img src={Logo} alt="Logo" />
              </span>
            </div>
          </div>
          <div className={`${currentToken ? 'w-full' : 'w-full border-stroke dark:border-strokedark lg:w-1/2 lg:border-l-2'}`}>
            <div className="w-full p-4 sm:p-12.5 lg:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                {`${user ? 'Actualiza la cuenta en' : 'Crea tu cuenta en '}`}<span className='text-red-500'> BomberApp</span>
              </h2>
              <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                  <label htmlFor='username' className="mb-2.5 block font-medium text-black dark:text-white">
                    Usuario
                  </label>
                  <div className="relative">
                    <InputText
                      id='username'
                      type="text"
                      placeholder="Ingresa tu nombre de usuario"
                      tooltip="Mínimo 3 caracteres" tooltipOptions={{ position: 'top' }}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      maxLength={15}
                      value={ username }
                      onChange={ e => setUsername( e.target.value ) }
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
                            d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                            fill=""
                          />
                          <path
                            d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor='dpi' className="mb-2.5 block font-medium text-black dark:text-white">
                    DPI
                  </label>
                  <div className="relative">
                    <InputText
                      id='dpi'
                      type="text"
                      tooltip="Corresponden a 13 dígitos" tooltipOptions={{ position: 'top' }}
                      placeholder="Ingresa el DPI"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      min={0}
                      maxLength={13}
                      value={ dpi }
                      onChange={ handleDPIChange }
                    />

                    <span className="absolute right-4 top-4">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
                    </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor='phone' className="mb-2.5 block font-medium text-black dark:text-white">
                    Teléfono
                  </label>
                  <div className="relative">
                    <InputText
                      id='phone'
                      type="text"
                      tooltip="Corresponden a 8 dígitos" tooltipOptions={{ position: 'top' }}
                      placeholder="Ingresa tu número de teléfono"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      min={0}
                      maxLength={8}
                      value={ phone }
                      onChange={ handlePhoneChange }
                    />

                    <span className="absolute right-4 top-4">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 15h12M6 6h12m-6 12h.01M7 21h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1Z"/>
                    </svg>                      
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor='fullName' className="mb-2.5 block font-medium text-black dark:text-white">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <InputText
                      id='fullName'
                      type="text"
                      maxLength={100}
                      tooltip="Mínimo 5 caracteres" tooltipOptions={{ position: 'top' }}
                      placeholder="Ingresa tu nombre completo"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ fullName }
                      onChange={ e => setFullName( e.target.value ) }
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
                            d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                            fill=""
                          />
                          <path
                            d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor='email' className="mb-2.5 block font-medium text-black dark:text-white">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      id='email'
                      type="email"
                      placeholder="Ingresa tu correo"
                      maxLength={100}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ email }
                      onChange={ handleEmailChange }
                      style={{ borderColor: isValidEmail ? 'initial' : 'red' }}
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
                    {!isValidEmail && <p style={{ color: 'red' }}>Correo electrónico inválido</p>}
                  </div>
                </div>

                { !user && (
                  <div className="mb-4">
                    <label htmlFor='password' className="mb-2.5 block font-medium text-black dark:text-white">
                      Contraseña
                    </label>
                    <div className="relative">
                       <Password
                          id='password'
                          required
                          className="rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          header={header}
                          footer={footer} 
                          toggleMask
                          feedback={true}
                          weakLabel="Débil"
                          mediumLabel="Media"
                          strongLabel="Fuerte"
                       />                      
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor='address' className="mb-2.5 block font-medium text-black dark:text-white">
                    Dirección
                  </label>
                  <div className="relative">
                    <InputTextarea required value={ address } onChange={(e) => setAddress(e.target.value)} rows={5} cols={30} maxLength={200} autoResize className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-nonedark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary text-lg" />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor='photography' className="mb-2.5 block font-medium text-black dark:text-white">
                    Fotografía (max. 5mb)
                  </label>
                  <div className="relative">
                    {imagePreview && (
                      <div className="mb-4">
                        <img src={imagePreview} alt="Preview" className="max-w-xs h-auto rounded-lg" />
                      </div>
                    )}
                  <InputText
                    id="photography"
                    type="file"
                    accept="image/jpeg, image/png"
                    className="border-[1px] w-full p-3 rounded-lg"
                    onChange={handleFileChange}
                  />

                    <span className="absolute right-4 top-4">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/>
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                    </span>
                  </div>
                </div>

                { currentToken?.user?.isAdmin && (
                  <>
                    <label htmlFor='rol' className="mb-2.5 block font-medium text-black dark:text-white">
                      Rol
                    </label>
                    <div className="mb-4">
                      <Dropdown
                        value={selectedRole}
                        onChange={handleRoleChange}
                        options={roles}
                        optionLabel="name"
                        placeholder="Selecciona un rol"
                        filter
                        valueTemplate={selectedRoleTemplate}
                        itemTemplate={roleOptionTemplate}
                        className="w-full md:w-14rem"
                        disabled = { user }
                        required
                      />
                    </div>
                    { selectedRole?.name === 'Bombero' && !user && (
                      <div className="mb-4">
                        <label htmlFor='shiftPreference' className="mb-2.5 block font-medium text-black dark:text-white">
                          Turno
                        </label>
                        <Dropdown value={selectedShiftPreference} onChange={(e) => setSelectedShiftPreference(e.value)} options={shiftPreferences} optionLabel="name" 
                        placeholder="Selecciona el turno" className="w-full md:w-14rem" />
                      </div>                      
                    )}
                  </>
                )}

                <div className="mb-5">
                  <input
                    type="submit"
                    value={`${ user ? 'Actualizar Usuario' : 'Crear cuenta'}`}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
                { !currentToken && (
                  <div className="mt-6 text-center">
                    <p>
                      ¿Ya tienes una cuenta?{' '}
                      <Link to="/login" className="text-primary">
                        Inicia sesión
                      </Link>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
