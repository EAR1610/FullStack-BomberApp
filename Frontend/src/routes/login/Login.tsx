// import { useEffect, useState } from "react";
// import logo from "../assets/bomber.png";

// const Login = () => {
    
//     const [year, setYear] = useState<number>(new Date().getFullYear());

//     useEffect(() => {
//       const currentYear = new Date().getFullYear();
//       setYear(currentYear);
//     }, []);

//   return (
//     <div className="w-screen h-screen overflow-y-auto p-12 bg-[#F6F6F6]">
//       <div className="w-full min-h-full h-max flex flex-col items-center justify-center gap-8">
//         <img src={logo} className="w-[134px] mb-5" />
//         <form className="w-[533px] max-w-[92vw] flex flex-col items-center justify-center bg-white p-8 rounded-lg">
//           <h1 className="text-[#4A4A4A] font-semibold text-2xl py-6">
//             Inicia Sesión
//           </h1>
//           <div className="flex flex-col gap-3 w-full">
//             <label htmlFor="email" className="w-full text-[#4A4A4A]">
//               Correo Electrónico
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Ingresa tu Correo"
//               className="border-[1px] w-full p-3 rounded-lg"
//             />
//           </div>
//           <div className="flex flex-col gap-3 w-full pt-7">
//             <label htmlFor="password" className="w-full text-[#4A4A4A]">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               placeholder="Ingresa tu Contraseña"
//               className="border-[1px] w-full p-4 rounded-lg"
//             />
//           </div>
//           <p className="text-[#4A4A4A] ml-auto py-8">¿Olvidaste tu Correo?</p>
//           <button className="bg-[#db4149] w-full p-3 text-lg text-white rounded-lg">
//             Login
//           </button>
//         </form>
//         <p className="text-[#666666] text-center">
//           Terms and Conditions | Privacy Policy
//         </p>
//         <p className="text-[#666666] text-center">BomberApp { year }</p>
//       </div>
//     </div>
//   )
// }

// export default Login

import { useContext, useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext)

  const { updateToken } = authContext;

  const navigate = useNavigate();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/login", {
        email,
        password,
      });

      console.log(res)
      updateToken(res.data)
      console.log(updateToken);

      navigate("/");
    } catch (err:any) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="email"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Email"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
          />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;