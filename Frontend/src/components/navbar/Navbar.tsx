// import { useContext, useEffect, useState } from "react";
// import "./Navbar.scss";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import { useNotificationStore } from "../../lib/notificationStore.tsx";
// import { AuthContextProps } from "../../interface/Auth.tsx";

// function Navbar() {
//   const [open, setOpen] = useState(false);

//   const authContext = useContext<AuthContextProps | undefined>(AuthContext);

//   if (!authContext)throw new Error("useContext(AuthContext) must be used within an AuthProvider");

//   const { currentToken } = authContext;

//   const fetch = useNotificationStore((state) => state.fetch);
//   const number = useNotificationStore((state) => state.number);

//   if( currentToken ) fetch();

//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//   }, [open]);


//   return (
//     <nav>
//       <div classNameName="left">
//         <a href="/" classNameName="logo">
//           <img src="/logo.png" alt="" />
//           <span>BomberApp</span>
//         </a>
//         <a href="/">Inicio</a>
//         <a href="/">Acerca</a>
//         <a href="/">Contacto</a>
//         <a href="/">Agentes</a>
//       </div>
//       <div classNameName="right">
//         {currentToken ? (
//           <div classNameName="user">
//             {/* <img src={currentToken.currenToken || "/noavatar.jpg"} alt="" />
//             <span>{currentToken.username}</span> */}
//             <Link to="/profile" classNameName="profile">
//               { number > 0 && <div classNameName="notification">{number}</div> }
//               <span>Profile</span>
//             </Link>
//           </div>
//         ) : (
//           <>
//             <a href="/login">¡Inicia Sesión!</a>
//             <a href="/register" classNameName="register">¡Regístrate!</a>
//           </>
//         )}
//         <div classNameName="menuIcon">
//           <img
//             src="/vite.svg"
//             alt=""
//             onClick={() => setOpen((prev) => !prev)}
//           />
//         </div>
//         <div classNameName={ open ? "menu active" : "menu" }>
//           <a href="/">Inicio</a>
//           <a href="/">Acerca de</a>
//           <a href="/">Contacto</a>
//           <a href="/">Agentes</a>
//           <a href="/">Iniciar Sesión</a>
//           <a href="/">Crear Cuenta</a>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


"use client";
import { Navbar } from "flowbite-react";
import logo from "../../assets/bomber.png";

function NavbarC() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="#">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BomberApp</span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Inicio
        </Navbar.Link>
        <Navbar.Link href="#">
          Acerca de nosotros
        </Navbar.Link>
        <Navbar.Link href="#">Iniciar sesión</Navbar.Link>
        <Navbar.Link href="#">Crear cuenta</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default NavbarC
