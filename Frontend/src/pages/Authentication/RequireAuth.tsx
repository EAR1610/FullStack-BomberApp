import React, { useContext, useEffect, useRef } from 'react';
import { Navigate, Outlet, useNavigate, useLocation  } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";

const RequireAuth: React.FC = () => {
  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  if (!currentToken) {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
};

export default RequireAuth;
