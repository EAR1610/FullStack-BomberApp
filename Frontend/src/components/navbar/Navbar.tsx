import { DarkThemeToggle, Navbar } from "flowbite-react";
import logo from "../../assets/bomber.png";

function NavbarC() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="BomberApp Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          BomberApp
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/">
          Inicio
        </Navbar.Link>
        <Navbar.Link href="/blog">Blog</Navbar.Link>
        <Navbar.Link href="/emergency">Emergencia</Navbar.Link>
        <Navbar.Link href="/login">Iniciar sesión</Navbar.Link>
        <Navbar.Link href="/register">Crear cuenta</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default NavbarC;
