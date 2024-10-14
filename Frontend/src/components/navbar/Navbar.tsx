import { Navbar } from "flowbite-react";
import logo from "../../assets/bomber.png";

function NavbarC() {
  return (
    <Navbar
      fluid
      rounded
      className="bg-red-600 shadow-md" // Fondo rojo oscuro con sombra ligera
    >
      <Navbar.Brand href="/">
        <img src={logo} className="mr-3 h-8 sm:h-10" alt="BomberApp Logo" />
        <span className="self-center whitespace-nowrap text-2xl font-bold text-white">
          BomberApp
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          href="/"
          className="text-white hover:text-gray-300 transition-colors duration-300 text-lg"
        >
          Inicio
        </Navbar.Link>
        <Navbar.Link
          href="/login"
          className="text-white hover:text-gray-300 transition-colors duration-300 text-lg"
        >
          Iniciar sesión
        </Navbar.Link>
        <Navbar.Link
          href="/register"
          className="text-white hover:text-gray-300 transition-colors duration-300 text-lg"
        >
          Crear cuenta
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarC;
