import { useContext, useEffect, useRef, useState } from "react"
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
const MyEmergencies = () => {
  const [myEmergencies, setMyEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null);

  useEffect(() => {
    const getMyEmergencies = async () => {
      try {
        const response = await apiRequestAuth.post(`/emergencies/my-emergencies/${currentToken?.user.id}`, {}, {
          headers: {
            Authorization: `Bearer ${currentToken?.token}`,
          },
        })
        setMyEmergencies(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMyEmergencies();
  }, [])
  

  return (
    <div>MyEmergencies</div>
  )
}

export default MyEmergencies