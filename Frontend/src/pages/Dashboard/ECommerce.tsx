import React, { useContext, useEffect } from 'react';
import { AuthContextProps } from '../../interface/Auth';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  const navigate = useNavigate();
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  useEffect(() => {
    if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
    if( currentToken?.user.isUser ) navigate('/app/emergency-request');
  }, []);
  
  return (
    <>
    <div className="space-y-6 flex">          
      <div className="w-full bg-gray-100 p-4 rounded-lg items-center">        
        <iframe title="Dashboard BomberApp Final" width="1650" height="1060" src="https://app.powerbi.com/view?r=eyJrIjoiYzU5MjFkMzUtODkwNi00OTJhLTg5NzktOGFjMzQzYTZkZjYyIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9" frameborder="0" allowFullScreen="true"></iframe>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
