import { useContext, useEffect, useState } from "react";
import logo from "../../assets/bomber.png";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";

const Login = () => {
    
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);

  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");

  const { updateToken } = authContext;

  const navigate = useNavigate();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
  }, []);

  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();    
    setError("");

    try {
      const res = await apiRequest.post("/login", {
        email,
        password,
      });

      updateToken(res.data);
      navigate("/app/dashboard");

    } catch (err:any) {
      setError(err.response.data.message);
    } finally {      
    }
  };

  return (
    <div className="w-screen h-screen overflow-y-auto p-12">
      <div className="w-full min-h-full h-max flex flex-col items-center justify-center gap-8">
        <img src={logo} className="w-[145px] mb-5 rounded-md" />
        <form onSubmit={ handleSubmit } className="w-[533px] max-w-[92vw] flex flex-col items-center justify-center bg-white p-8 rounded-lg">
          <h1 className="text-[#4A4A4A] font-semibold text-2xl py-6">
            Inicia Sesión en <span className="text-[#db4149]">BomberApp</span>
          </h1>
          <div className="flex flex-col gap-3 w-full">
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
              onChange={ e => setEmail(e.target.value)}
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
              onChange={ e => setPassword(e.target.value) }
            />
          </div>
          { error && <span>{ error }</span> }
          <div className="flex w-full mt-2">
            <Link to="/register">¿No tienes una cuenta? <span className="bg-[#db4149] text-white rounded-lg p-1 mt-10">Regístrate</span></Link>
            <p className="text-[#4A4A4A] ml-auto py-8">¿Olvidaste tu Correo?</p>
          </div>
          <button className="bg-[#db4149] w-full p-3 text-lg text-white rounded-lg">
            Iniciar sesión
          </button>
        </form>
        <p className="text-[#db4149] text-center">BomberApp { year }</p>
      </div>
    </div>
  )
}

export default Login

