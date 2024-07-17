import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore.tsx";
import { AuthContextProps } from "../../interface/Auth.tsx";

function Navbar() {
  const [open, setOpen] = useState(false);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);

  if (!authContext) {
    throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  }

  const { currentToken } = authContext;

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if( currentToken ) fetch();

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>BomberApp</span>
        </a>
        <a href="/">Inicio</a>
        <a href="/">Acerca</a>
        <a href="/">Contacto</a>
        <a href="/">Agentes</a>
      </div>
      <div className="right">
        {currentToken ? (
          <div className="user">
            <img src={currentToken.currenToken || "/noavatar.jpg"} alt="" />
            <span>{currentToken.username}</span>
            <Link to="/profile" className="profile">
              { number > 0 && <div className="notification">{number}</div> }
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login">¡Inicia Sesión!</a>
            <a href="/register" className="register">¡Regístrate!</a>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Inicio</a>
          <a href="/">Acerca de</a>
          <a href="/">Contacto</a>
          <a href="/">Agentes</a>
          <a href="/">Iniciar Sesión</a>
          <a href="/">Crear Cuenta</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;