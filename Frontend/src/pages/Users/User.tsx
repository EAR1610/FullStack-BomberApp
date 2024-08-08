import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import Table from "../../components/Table/Table";
import { Toast } from 'primereact/toast';

const User = () => {

  const [users, setUsers] = useState([]);
  const [viewActiveUsers, setViewActiveUsers] = useState(true);

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
        if(response) {
          setUsers(response.data);
        }
      } catch (error) {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los usuarios' });
      }
    }
    getUsers();
  }, [users, viewActiveUsers]);

  return (    
    <>
      <Toast ref={toast} />
      <Table data={users} setUsers={setUsers} viewActiveUsers={viewActiveUsers} setViewActiveUsers={setViewActiveUsers} />
    </>
  );
}

export default User