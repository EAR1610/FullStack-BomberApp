import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";

import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import TableEmergencies from "../../components/Table/TableEmergencies";

const Emergency = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [viewStatusEmergency, setViewStatusEmergency] = useState(0);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const navigate = useNavigate();

  const toast = useRef(null);

  useEffect(() => {
    const getEmergencies = async () => {

      if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
      if( currentToken?.user.isUser ) navigate('/app/emergency-request');

      try {
        let response;
        if (viewStatusEmergency === 0) {
          response = await apiRequestAuth.get("emergencies", {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });          
        } else if (viewStatusEmergency === 1) {
          response = await apiRequestAuth.post("emergencies/in-process-emergencies", {},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        } else if (viewStatusEmergency === 2) {
          response = await apiRequestAuth.post("emergencies/cancelled-emergencies", {},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            }
          })
        } else if (viewStatusEmergency === 3) {
          response = await apiRequestAuth.post("emergencies/rejected-emergencies", {},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            }
          })
        } else if (viewStatusEmergency === 4) {
          response = await apiRequestAuth.post("emergencies/attended-emergencies", {},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            }
          })
        }

        if (response) setEmergencies(response.data);

      } catch (error) {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los usuarios' });
      }
    }

    getEmergencies();
  }, [ emergencies, viewStatusEmergency ]);
  

  return (
    <>
      <Toast ref={toast} />
      <TableEmergencies data={emergencies} viewStatusEmergency={viewStatusEmergency} setViewStatusEmergency={setViewStatusEmergency} />
    </>
  )
}

export default Emergency