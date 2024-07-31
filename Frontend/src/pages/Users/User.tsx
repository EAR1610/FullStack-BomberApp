import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import Table from "../../components/Table/Table";
import { Toast } from 'primereact/toast';

const User = () => {

  const [users, setUsers] = useState([]);

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
        const users = await apiRequestAuth.get("/",{
          headers: {
            Authorization: `Bearer ${currentToken?.token}`
          }
        });
        setUsers(users.data);
      } catch (error) {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los usuarios' });
      }
    }
    getUsers();
  }, [users]);

  return (    
    <>
      <Toast ref={toast} />
      <Table data={users}/>
    </>
  );
}

export default User