import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { createLog, handleErrorResponse } from '../helpers/functions';
import { AuthContextProps } from '../interface/Auth';
import { AuthContext } from '../context/AuthContext';
import { apiRequest, apiRequestAuth } from '../lib/apiRequest';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';

const Profile = () => {
  const [errorMessages, setErrorMessages] = useState<string>('');
  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;
  const userId = currentToken?.user?.id || 1;

  const toast = useRef(null);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [dpi, setDpi] = useState('');
  const [penalizations, setPenalizations] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [photography, setPhotography] = useState<File | null>(null);
  const [status, setStatus] = useState('active');
  const [roleId, setRoleId] = useState(3);
  const [imagePreview, setImagePreview] = useState<null | string>(null)
  const [selectedShiftPreference, setSelectedShiftPreference] = useState(null);

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

  const header = <div className="font-bold mb-3">Escribe tu contraseña</div>;
  const footer = (
      <>
          <Divider />
          <p className="mt-2">Sugerencias</p>
          <ul className="pl-2 ml-2 mt-0 line-height-3">
              <li>Al menos una letra minúscula</li>
              <li>Al menos una letra mayúscula</li>
              <li>Al menos un número</li>
              <li>Mínimo 8 caracteres</li>
          </ul>
      </>
    );

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if( newPassword !== confirmPassword ){
      showAlert('warn', 'Error', 'Las contraseñas no coinciden');
      return;
    }
    const formData = new FormData();
    formData.append('oldPassword', currentPassword);
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);

    try {
      await apiRequestAuth.post(`/change-password`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken?.token}`
        },
      });
      showAlert('info', 'Info', 'Contraseña actualizada correctamente');

      await createLog(userId, 'ACTUALIZAR', 'USUARIO', `Se ha actualizado la contraseña del usuario: ${fullName}`, currentToken?.token);

      setTimeout(() => {
        if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
        if( currentToken?.user.isUser ) navigate('/app/emergency-request');
        if( currentToken?.user.isAdmin ) navigate('/app/dashboard');
      }, 1500);

    } catch (err) {
      showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await apiRequest.get('/me', {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`
          }
        })
        if (response) {
          setUsername(response.data.user.username);
          setFullName(response.data.user.fullName);
          setDpi(response.data.user.dpi);
          setPenalizations(response.data.user.penalizations);
          setEmail(response.data.user.email);
          setPassword(response.data.user.password);
          setAddress(response.data.user.address);
          setStatus(response.data.user.status);
          setRoleId(response.data.user.roleId);
          setPhotography(response.data.user.photography);
          fetchUserImage(response.data.user.photography);
        }
      } catch (error) {
        console.log('Error al obtener la información del usuario');
      }
    }

    getUser();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    if (
      !username || !fullName || !email || !address || !dpi
    ) {
      showAlert('error', 'Error', 'Todos los campos son obligatorios');
      return;

    } else {
      formData.append('username', username);
      formData.append('fullName', fullName);
      formData.append('dpi', dpi);
      formData.append('penalizations', JSON.stringify(penalizations));
      formData.append('email', email);
      formData.append('address', address);
      formData.append('roleId', JSON.stringify(roleId));
      formData.append('status', status);
      formData.append('shiftPreference', selectedShiftPreference !== null ? selectedShiftPreference?.name : '');
      if (typeof (photography) !== "string") formData.append('photography', photography);
    }

    try {
      await apiRequestAuth.put(`/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken?.token}`
        },
      });

      await createLog(userId, 'ACTUALIZAR', 'USUARIO', `Se ha actualizado la informacion del usuario: ${fullName} con dpi: ${dpi}`, currentToken?.token);
      showAlert('info', 'Info', 'Usuario Actualizado!');

      setTimeout(() => {
        if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
        if( currentToken?.user.isUser ) navigate('/app/emergency-request');
        if( currentToken?.user.isAdmin ) navigate('/app/dashboard');
      }, 1500);

    } catch (err: any) {
      console.log(err);
      showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
    }
  };

  const showAlert = (severity: string, summary: string, detail: string) => toast.current.show({ severity, summary, detail });

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Div para la información personal del usuario */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Información Personal</h2>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
            <Toast ref={toast} />
            <div className="flex flex-wrap items-center">
              <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor='username' className="mb-2.5 block font-medium text-black dark:text-white">
                        Usuario
                      </label>
                      <div className="relative">
                        <input
                          id='username'
                          type="text"
                          placeholder="Ingresa tu nombre de usuario"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          required
                          value={username}
                          onChange={e => setUsername(e.target.value)}
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
                        <input
                          id='dpi'
                          type="number"
                          placeholder="Ingresa el DPI"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          required
                          min={0}
                          maxLength={13}
                          value={dpi}
                          onChange={e => setDpi(e.target.value)}
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
                      <label htmlFor='fullName' className="mb-2.5 block font-medium text-black dark:text-white">
                        Nombre completo
                      </label>
                      <div className="relative">
                        <input
                          id='fullName'
                          type="text"
                          placeholder="Ingresa tu nombre completo"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          required
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
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
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
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
                    <div className="mb-4">
                      <label htmlFor='address' className="mb-2.5 block font-medium text-black dark:text-white">
                        Dirección
                      </label>
                      <div className="relative">
                        <input
                          id='address'
                          type="text"
                          placeholder="Ingresa tu dirección"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          required
                          value={address}
                          onChange={e => setAddress(e.target.value)}
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
                      <label htmlFor='photography' className="mb-2.5 block font-medium text-black dark:text-white">
                        Fotografía
                      </label>
                      <div className="relative">
                        {imagePreview && (
                          <div className="mb-4 max-w-full">
                            <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg" />
                          </div>
                        )}
                        <input
                          id="photography"
                          type="file"
                          accept="image/jpeg, image/png"
                          className="border-[1px] w-full p-3 rounded-lg"
                          onChange={handleFileChange}
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

                    <div className="mb-5">
                      <input
                        type="submit"
                        value={'Actualizar cuenta'}
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Div para cambiar la contraseña */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Cambiar Contraseña</h2>  
          <form onSubmit={handleChangePassword}>
            <div className="mb-4 w-full">
              <label
                htmlFor="currentPassword"
                className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
              >
                Contraseña Actual
              </label>
              <Password
                id='currentPassword'
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={password} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                header={header}
                footer={footer} 
                toggleMask
                feedback={true}
                weakLabel="Débil"
                mediumLabel="Media"
                strongLabel="Fuerte"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
              >
                Contraseña Nueva
              </label>
              <Password
                id='newPassword'
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={password} 
                onChange={(e) => setNewPassword(e.target.value)} 
                header={header}
                footer={footer} 
                toggleMask
                feedback={true}
                weakLabel="Débil"
                mediumLabel="Media"
                strongLabel="Fuerte"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
              >
                Confirmar Contraseña
              </label>
              <Password
                id='confirmPassword'
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={password} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                header={header}
                footer={footer} 
                toggleMask
                feedback={true}
                weakLabel="Débil"
                mediumLabel="Media"
                strongLabel="Fuerte"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Cambiar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
