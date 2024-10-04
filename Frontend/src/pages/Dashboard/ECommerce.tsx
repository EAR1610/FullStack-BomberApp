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
  }, []);
  
  return (
    <>
    <div className="space-y-6">
      <div className="w-full bg-gray-100 p-4 rounded-lg shadow-5">
        <iframe title="Dashboard Principal BomberApp" width="1024" height="804" src="https://app.powerbi.com/view?r=eyJrIjoiNGE3NmQ4ZjMtN2U1Ni00N2ViLTliN2YtMzdjZDE0ZTUyNDkxIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9&filterPaneEnabled=false&navContentPaneEnabled=false" frameborder="0" allowFullScreen="true"></iframe>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-gray-100 p-2 rounded-lg">
          <iframe title="Dashboard insumos y tipo insumo" width="500" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiZDk2MGRlYTItOWU1MS00YTFmLWE5MTYtMTk2ODI5MzM3ZGZjIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9&filterPaneEnabled=false&navContentPaneEnabled=false" frameborder="0" allowFullScreen="true"></iframe>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg">          
          <iframe title="Dashboard Usuarios Por Estado" width="500" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiNDAyYzM0MjctMWMzNy00NTAyLTlhNDUtYTE1OWY0ZmM3MzU5IiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9&filterPaneEnabled=false&navContentPaneEnabled=false" frameborder="0" allowFullScreen="true"></iframe>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[70%,30%] gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">          
          {/* <p>Gráfica 1 - 70%</p> */}
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">          
          {/* <p>Gráfica 2 - 30%</p> */}
        </div>
      </div>
      
      <div className="w-full bg-gray-100 p-4 rounded-lg">        
        {/* <p>Última gráfica - 100% ancho</p> */}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
