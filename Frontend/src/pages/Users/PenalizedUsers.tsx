import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import TablePenalizedUsers from "../../components/Table/TablePenalizedUsers";


const PenalizedUsers = () => {  
  const [penalizedUsers, setPenalizedUsers] = useState([]);
  const [changedAPenalizedUser, setChangedAPenalizedUser] = useState(false);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

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
    const getPenalizedUsers = async () => {
      try {
        let response;
        response = await apiRequestAuth.post("/penalized-users", {},{
          headers: {
            Authorization: `Bearer ${currentToken?.token}`
          }
        });
        if(response) setPenalizedUsers(response.data);
      } catch (error) {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los usuarios' });
      }
    }
    getPenalizedUsers();
  }, [changedAPenalizedUser]);

  return (
    <>
      <Toast ref={toast} />
      <TablePenalizedUsers 
        data={penalizedUsers}
        changedAPenalizedUser= {changedAPenalizedUser}
        setChangedAPenalizedUser={setChangedAPenalizedUser}
      />
    </>
  )
}

export default PenalizedUsers