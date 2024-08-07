import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import TableTools from "../../components/Table/TableTools";
import { Toast } from 'primereact/toast';
const Tools = () => {

  const [tools, setTools] = useState([]);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null);

  useEffect(() => {
    /**
    * ? Retrieves a list of users from the API using the current authentication token.
    *
    * @return {Promise<void>} - A promise that resolves when the users are retrieved successfully.
    */
     const getTools = async () => {
       try {
         const tools = await apiRequestAuth.get("/tool",{
           headers: {
             Authorization: `Bearer ${currentToken?.token}`
           }
         });
         setTools(tools.data);
       } catch (error) {
         toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener las herramientas' });
       }
     }
     getTools();
   },[tools]);
  
  return (
    <>
      <Toast ref={toast} />
      <TableTools data={tools} />
    </>
  )
}

export default Tools