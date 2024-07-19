// import "./Layout.scss";
// import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";
import NavbarC from "../../components/navbar/Navbar";

function Layout() {
  return (
    <div className="">
      <div className="">
        <NavbarC />
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

function RequireAuth() {
  const authContext = useContext<AuthContextProps | undefined>(AuthContext);

  if ( !authContext ) throw new Error("useContext(AuthContext) must be used within an AuthProvider");

  const { currentToken } = authContext;

  if ( !currentToken ) return <Navigate to="/login" />;

  else {
    return (
      <div className="">
        <div className="">
          <NavbarC />
        </div>
        <div className="">
          <Outlet />
        </div>
      </div>
    );
  }
}

export { Layout, RequireAuth };