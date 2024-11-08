import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import Table from "../../components/Table/Table";
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import { handleErrorResponse } from "../../helpers/functions";
// import { removeToken } from "../../helpers/functions";

const User = () => {

  const [users, setUsers] = useState([]);
  const [changedAUser, setChangedAUser] = useState(false);
  const [viewActiveUsers, setViewActiveUsers] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken, updateToken } = authContext;

  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {

    if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
    if( currentToken?.user.isUser ) navigate('/app/emergency-request');
    
   /**
   * ? Retrieves a list of users from the API using the current authentication token.
   *
   * @return {Promise<void>} - A promise that resolves when the users are retrieved successfully.
   */
    const getUsers = async () => {
      try {
        let response;
        if (viewActiveUsers) {
          response = await apiRequestAuth.get("/",{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`
            }
          });        
        } else {
          response = await apiRequestAuth.post("/inactive-users",{},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`
            }
          });    
        }
        if(response) setUsers(response.data);
      } catch (err) {
        if(err.request.statusText === 'Unauthorized'){
          showAlert("error", "Sesion expirada", "Vuelve a iniciar sesion");
          setTimeout(() => {
            navigate('/login', { replace: true });
            updateToken('' as any);
          }, 1500);
        } else {
          showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
        }
      }
    }
    getUsers();
  }, [changedAUser, viewActiveUsers]);

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (    
    <>
      <Toast ref={toast} />
      <Table 
        data={users} 
        viewActiveUsers={viewActiveUsers} 
        setViewActiveUsers={setViewActiveUsers} 
        changedAUser={changedAUser} 
        setChangedAUser={setChangedAUser}
      />
    </>
  );
}

export default User