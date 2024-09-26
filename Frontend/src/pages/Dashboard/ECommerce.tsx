import React, { useContext, useEffect } from 'react';
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ECommerce: React.FC = () => {

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  const navigate = useNavigate();
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  useEffect(() => {
    if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
  }, []);
  
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <iframe title="Dashboard Principal BomberApp" width="1024" height="804" src="https://app.powerbi.com/view?r=eyJrIjoiNGE3NmQ4ZjMtN2U1Ni00N2ViLTliN2YtMzdjZDE0ZTUyNDkxIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9&chrome=off" frameborder="0" allowFullScreen="true"></iframe>
      </div>
    </>
  );
};

export default ECommerce;
