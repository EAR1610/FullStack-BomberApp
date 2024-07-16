import { useEffect, useState } from "react";
import logo from "../assets/bomber.png";

const Login = () => {
    
    const [year, setYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
      const currentYear = new Date().getFullYear();
      setYear(currentYear);
    }, []);

  return (
    <div className="w-screen h-screen overflow-y-auto p-12 bg-[#F6F6F6]">
      <div className="w-full min-h-full h-max flex flex-col items-center justify-center gap-8">
        <img src={logo} className="w-[134px] mb-5" />
        <form className="w-[533px] max-w-[92vw] flex flex-col items-center justify-center bg-white p-8 rounded-lg">
          <h1 className="text-[#4A4A4A] font-semibold text-2xl py-6">
            Inicia Sesión
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
            />
          </div>
          <p className="text-[#4A4A4A] ml-auto py-8">¿Olvidaste tu Correo?</p>
          <button className="bg-[#db4149] w-full p-3 text-lg text-white rounded-lg">
            Login
          </button>
        </form>
        <p className="text-[#666666] text-center">
          Terms and Conditions | Privacy Policy
        </p>
        <p className="text-[#666666] text-center">BomberApp { year }</p>
      </div>
    </div>
  )
}

export default Login