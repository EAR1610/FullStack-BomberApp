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
        

const SignUp: React.FC = ({ user, setVisible }:any) => {
  
  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken, updateToken } = authContext;  
  const navigate = useNavigate();
  
  const toast = useRef(null);
  
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [photography, setPhotography] = useState<File | null>(null);
  const [status, setStatus] = useState('active');
  const [error, setError] = useState("");
  const [roleId, setRoleId] = useState(3);

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

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhotography(user.photography || null);
      setPassword(user.password || '');
      setAddress(user.address || '');
      setStatus(user.status || 'active');
      setRoleId(user.roleId || 3);
    }
  }, [user]);

  const roles = [
    { id: 1, name: "Administrador" },
    { id: 2, name: "Bombero" },
    { id: 3, name: "Usuario" }
  ];

  // const statusList = [
  //   { id: 1, name: "Activo", value: 'active' },
  //   { id: 2, name: "Inactivo", value: 'inactive' }
  // ];

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

  // const selectedStatusTemplate = (option:any, props:any) => {
  //   console.log(option)
  //   if (option) {
  //     return (
  //       <div className="flex align-items-center">
  //         <span className="mr-2">{option.name}</span>
  //       </div>
  //     );
  //   }
  
  //   return <span>{props.placeholder}</span>;
  // };

  const roleOptionTemplate = (option:any) => {
      return (
          <div className="flex align-items-center">
              <span className="mr-2">{option.name}</span>
          </div>
      );
  };

  // const statusOptionTemplate = (option:any) => {
  //   return (
  //     <div className="flex align-items-center">
  //       <span className="mr-2">{option.name}</span>
  //     </div>
  //   );
  // };

  const handleRoleChange = (e:any) => setRoleId(e.value.id);
  // const handleStatusChange = (e:any) => setStatus(e.value);
    
  const selectedRole = roles.find(role => role.id === roleId); 
  // const selectedStatus = statusList.find(statusL => statusL.value == status);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png'];
      
      if (!validTypes.includes(file.type)) {
        setError("Solo se permiten archivos JPG y PNG.");
        setPhotography(null);
      } else {
        setError("");
        setPhotography(file);
      }
    }
  };
  
  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement> ) => {    
    e.preventDefault();    
    setError("");
    
    const formData = new FormData();

    if(user){

      if ( 
        !username || !fullName || !email  || !address
      ) {
        setError("Todos los campos son obligatorios.");
        return;

      } else {        
        formData.append('username', username);
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('address', address);
        formData.append('roleId', JSON.stringify(roleId));
        if ( typeof(photography) !== "string") formData.append('photography', photography);
      } 

    } else{

      if ( 
        !username || !fullName || !email || 
        !password || !address || !photography 
      ) {
        setError("Todos los campos son obligatorios.");
        return;
      } else {
        formData.append('username', username);
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('address', address);
        // formData.append('status', JSON.stringify(status));
        formData.append('roleId', JSON.stringify(roleId));
        if (photography) formData.append('photography', photography);
      }

    }  

    try {

      if (user) {
        await apiRequestAuth.put(`/${user.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentToken?.token}`
          },
        });
        setVisible(false);        

      } else {
        const res =await apiRequest.post("/register", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if(!currentToken){
          updateToken( res.data );
          navigate("/app/dashboard");          
        }
        showAlert('info', 'Info', 'Usuario Creado!');
      }
      
    } catch (err:any) {
      setError(err.response.data.message);
    }
  };

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (
    <>    
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark m-2">
      <Toast ref={toast} />
        <div className="flex flex-wrap items-center">
            
          <div className={`${currentToken ? 'hidden' : 'hidden w-full xl:block xl:w-1/2'}`}>
            <div className="py-17.5 px-26 text-center">              
              <Link className="mb-5.5 inline-block" to="/">              
              </Link>
              <p className="2xl:px-20">
                Crea una cuenta en BomberApp y empieza a disfrutar de lo que puedes aprender o ayudar
              </p>            
            
              <span className="mt-5 inline-block">
              <img src={Logo} alt="Logo" />
              </span>
            </div>
          </div>
          <div className={`${currentToken ? 'w-full' : 'border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2'}`}>
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                Crea tu cuenta en <span className='text-red-500'>BomberApp</span>
              </h2>
              <form onSubmit={ handleSubmit }>
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
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                      value={ email }
                      onChange={ e => setEmail( e.target.value )}
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

                { !user && (
                  <div className="mb-4">
                    <label htmlFor='password' className="mb-2.5 block font-medium text-black dark:text-white">
                      Contraseña
                    </label>
                    <div className="relative">
                       <Password
                          id='password'
                          required
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          header={header} 
                          footer={footer} 
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
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                      </span>
                    </div>
                  </div>
                )}

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
                      value={ address }
                      onChange={ e => setAddress( e.target.value ) }
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

                { currentToken?.user?.isAdmin && (
                  <>
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
                        required
                      />
                    </div> 
                    {/* <div className="mb-4">
                      <Dropdown
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        options={statusList}
                        optionLabel="name"
                        placeholder="Selecciona el estado"
                        filter
                        valueTemplate={selectedStatusTemplate}
                        itemTemplate={statusOptionTemplate}
                        className="w-full md:w-14rem"
                        required
                      />
                    </div>  */}
                  </>
                )}

                <div className="mb-5">
                  <input
                    type="submit"
                    value={`${ user ? 'Actualizar Usuario' : 'Crear cuenta'}`}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
                { error && <span>{ error }</span> }

                {/* <button className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_191_13499)">
                        <path
                          d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                          fill="#34A853"
                        />
                        <path
                          d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                          fill="#EB4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_191_13499">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Crea una cuenta con Google
                </button> */}

                <div className="mt-6 text-center">
                  <p>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="text-primary">
                      Inicia sesión
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

export default SignUp;
