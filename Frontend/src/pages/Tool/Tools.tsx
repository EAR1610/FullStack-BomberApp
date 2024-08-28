import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import TableTools from "../../components/Table/TableTools";
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
const Tools = () => {

  const [tools, setTools] = useState([]);
  const [viewActiveTools, setViewActiveTools] = useState(true);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const navigate = useNavigate();

  const toast = useRef(null);

  useEffect(() => {

    if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
    
    /**
    * ? Retrieves a list of tools from the API using the current authentication token.
    *
    * @return {Promise<void>} - A promise that resolves when the tools are retrieved successfully.
    */
     const getTools = async (): Promise<void> => {
       try {
        let response;
        if (viewActiveTools) {
          response = await apiRequestAuth.get("/tool",{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`
            }
          });
        } else {
          response = await apiRequestAuth.post("/tool/inactive-tools",{},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`
            }
          });
        } 
        if(response) setTools(response.data);
       } catch (error) {
         toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener las herramientas' });
       }
     }
     getTools();
   },[tools, viewActiveTools]);
  
  return (
    <>
      <Toast ref={toast} />
      <TableTools data={tools} viewActiveTools={viewActiveTools} setViewActiveTools={setViewActiveTools} />
    </>
  )
}

export default Tools