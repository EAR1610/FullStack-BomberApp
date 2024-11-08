import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import TableToolTypes from "../../components/Table/TableToolTypes";
import { useNavigate } from "react-router-dom";

const ToolsType = () => {
  const [toolsTypes, setToolsTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewActiveToolsType, setViewActiveToolsType] = useState(true);
  const [isChangedToolType, setIsChangedToolType] = useState(false);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const navigate = useNavigate();

  const toast = useRef(null);

  useEffect(() => {

    if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
    
        /**
     * ? Retrieves a list of tool types from the API using the current authentication token.
     *
     * @return {Promise<void>} - A promise that resolves when the tool types are retrieved successfully.
     */
    const getToolsTypes = async () => {
      try {
        let response;
        if (viewActiveToolsType) {
          response = await apiRequestAuth.get("/tool-type", {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`
            }
          });
        } else {
          response = await apiRequestAuth.post("/tool-type/inactive-tool-types",{}, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`
            }
          });
        }
        if( response ) setToolsTypes(response.data);
        setLoading(false);
      } catch (error) {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los registros' });
      }
    }
    getToolsTypes();
  }, [isChangedToolType, viewActiveToolsType]);
  

  return (
    <>
      <Toast ref={toast} />
      <TableToolTypes 
        data={toolsTypes} 
        viewActiveToolsType={viewActiveToolsType} 
        setViewActiveToolsType={setViewActiveToolsType} 
        loading={loading} 
        isChangedToolType={isChangedToolType}
        setIsChangedToolType={setIsChangedToolType}
      />
    </>
  )
}

export default ToolsType