import { createContext, useEffect, useState } from "react";
import { AuthContextProps, AuthProviderProps } from "../interface/Auth";
import { CurrentTokenI } from "../helpers/Interfaces";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * ? SE CREA UN CONTEXTO PARA LA AUTENTICACIÓN DEL USUARIO. EN ESTE CASO, ES MEDIANTE EL TOKEN QUE SE ADQUIERE AL AUTENTICARSE Y MEDIANTE ESE ELEMENTO
 * ? SE DEBE DE ENVIAR POR CADA PETICIÓN DENTRO DE LA APLICACIÓN. ASEGURÁNDONOS ASÍ, DE QUE LA PERSONA SEA LA CORRECTA. 
*/

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentToken, setCurrentToken] = useState<CurrentTokenI | null>(
    localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")!) : null
  );

  const updateToken = ( token: CurrentTokenI ) => setCurrentToken( token );

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(currentToken));
  }, [currentToken]);

  return (
    <AuthContext.Provider value={{ currentToken, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};