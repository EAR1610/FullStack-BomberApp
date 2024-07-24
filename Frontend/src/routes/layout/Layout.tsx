import { Outlet } from "react-router-dom";
import NavbarC from "../../components/navbar/Navbar";

function Layout() {
  return (
    <div className="">
      <NavbarC />
      <Outlet />
    </div>
  );
}

export { Layout };
