import { useContext, useEffect, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import Table from "../../components/Table/Table";

const User = () => {

  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

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
        setError("Ha ocurrido un error al obtener los usuarios");
      }
    }
    getUsers();
  }, []);

  return (    
      <Table data={users}/>
  );
}

export default User