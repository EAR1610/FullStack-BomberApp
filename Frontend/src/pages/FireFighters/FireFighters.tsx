import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import TableFirefighters from "../../components/Table/TableFirefighters";


const FireFighters = () => {
    const [firefighters, setFirefighters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewActiveFirefighters, setViewActiveFirefighters] = useState(true);
  
    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
  
    const toast = useRef(null);

    useEffect(() => {
      const getFirefighters = async () => {
          try {
            let response;
            if (viewActiveFirefighters) {
              response = await apiRequestAuth.get("/firefighter", {
                headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
                },
              });
            } else {
              response = await apiRequestAuth.post("/firefighter/inactive-firefighters", {}, {
                headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
                },
              });
            }
            if (response) setFirefighters(response.data);
            setLoading(false);
          } catch (error) {
            console.log(error);
          }
      }

      getFirefighters()
    }, [firefighters, setViewActiveFirefighters])
    


  return (
    <>
      <Toast ref={toast} />
      <TableFirefighters data={firefighters} loading={loading} setViewActiveFirefighters={setViewActiveFirefighters} viewActiveFirefighters={viewActiveFirefighters} 
      />
    </>
  )
}

export default FireFighters