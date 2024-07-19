import { useContext, useEffect, useState } from "react";
import logo from "../../assets/bomber.png";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
    
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [photography, setPhotography] = useState<File | null>(null);
  const [status, setStatus] = useState(true);
  const [error, setError] = useState("");

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);

  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");

  const { updateToken } = authContext;
  
  const navigate = useNavigate();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
  }, []);

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
    debugger;

    if ( 
      !username || !fullName || !email || 
      !password || !address || !photography 
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('address', address);
    formData.append('status', JSON.stringify(status));
    if (photography) formData.append('photography', photography);
  
    try {
      const res = await apiRequest.post("/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateToken( res.data )
      navigate("/dashboard");

    } catch (err:any) {
      setError(err.response.data.message);
    } finally {      
    }
  };

  return (
    <div className="w-screen h-screen overflow-y-auto p-12 bg-[#F6F6F6]">
      <div className="w-full min-h-full h-max flex flex-col items-center justify-center gap-8">
        <img src={logo} className="w-[134px] mb-5" />
        <form onSubmit={ handleSubmit } className="w-[533px] max-w-[92vw] flex flex-col items-center justify-center bg-white p-8 rounded-lg">
          <h1 className="text-[#4A4A4A] font-semibold text-2xl py-6">
            Crea tu cuenta en <span className="text-[#db4149] ">BomberApp</span>
          </h1>
          <div className="flex flex-col gap-3 w-full">
            <label htmlFor="username" className="w-full text-[#4A4A4A]">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Ingresa tu Nombre de usuario"
              className="border-[1px] w-full p-3 rounded-lg"
              required
              value={ username }
              onChange={ e => setUsername( e.target.value ) }
            />
          </div>
          <div className="flex flex-col gap-3 w-full pt-7">
            <label htmlFor="fullName" className="w-full text-[#4A4A4A]">
              Nombre Completo
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Ingresa tu Nombre"
              className="border-[1px] w-full p-3 rounded-lg"
              required
              value={ fullName }
              onChange={ e => setFullName( e.target.value ) }
            />
          </div>
          <div className="flex flex-col gap-3 w-full pt-7">
            <label htmlFor="email" className="w-full text-[#4A4A4A]">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ingresa tu Correo"
              className="border-[1px] w-full p-3 rounded-lg"
              required
              value={ email }
              onChange={ e => setEmail( e.target.value )}
            />
          </div>
          <div className="flex flex-col gap-3 w-full pt-7">
            <label htmlFor="password" className="w-full text-[#4A4A4A]">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu Contraseña"
              className="border-[1px] w-full p-4 rounded-lg"
              required
              value={ password }
              onChange={ e => setPassword( e.target.value ) }
            />
          </div>
          <div className="flex flex-col gap-3 w-full pt-7">
            <label htmlFor="address" className="w-full text-[#4A4A4A]">
              Dirección
            </label>
            <input
              id="address"
              type="text"
              placeholder="Ingresa tu dirección"
              className="border-[1px] w-full p-4 rounded-lg"
              required
              value={ address }
              onChange={ e => setAddress( e.target.value ) }
            />
          </div>
          <div className="flex flex-col gap-3 w-full pt-7">
            <label htmlFor="photography" className="w-full text-[#4A4A4A]">
              Fotografía
            </label>
            <input
              id="photography"
              type="file"
              accept="image/jpeg, image/png"
              className="border-[1px] w-full p-3 rounded-lg"
              required
              onChange={handleFileChange}
            />
          </div>
          { error && <span>{ error }</span> }
          <div className="flex w-full mt-2">
            <Link to="/login">¿Ya tienes una cuenta? <span className="bg-[#db4149] text-white rounded-lg p-1 mt-10">Inicia sesión</span></Link>
            <p className="text-[#4A4A4A] ml-auto py-8">¿Olvidaste tu Contraseña?</p>
          </div>
          <button className="bg-[#db4149] w-full p-3 text-lg text-white rounded-lg">
            Crear cuenta
          </button>
        </form>
        <p className="text-[#666666] text-center">BomberApp { year }</p>
      </div>
    </div>
  )
}

export default Register

