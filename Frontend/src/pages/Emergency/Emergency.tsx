import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";

import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import TableEmergencies from "../../components/Table/TableEmergencies";
import { handleErrorResponse } from "../../helpers/functions";
import { useEmergency } from "../../context/EmergencyContext";

const Emergency = () => {
  const [changeStatusEmergency, setChangeStatusEmergency] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken, updateToken } = authContext;

  const emergency = useEmergency();
  const { emergencies, setEmergencies, viewStatusEmergency, setViewStatusEmergency } = emergency;  

  const navigate = useNavigate();
  const toast = useRef(null); 

  useEffect(() => {
    const getEmergencies = async () => {
      
      if (currentToken?.user.isFirefighter) navigate('/app/firefighter-shift');
      if (currentToken?.user.isUser) navigate('/app/emergency-request');

      try {

        let response;
        if (viewStatusEmergency === 0) {
          response = await apiRequestAuth.get("emergencies", {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        } else if (viewStatusEmergency === 1) {
          response = await apiRequestAuth.post("emergencies/in-process-emergencies", {}, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        } else if (viewStatusEmergency === 2) {
          response = await apiRequestAuth.post("emergencies/cancelled-emergencies", {}, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            }
          })
        } else if (viewStatusEmergency === 3) {
          response = await apiRequestAuth.post("emergencies/rejected-emergencies", {}, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            }
          })
        } else if (viewStatusEmergency === 4) {
          response = await apiRequestAuth.post("emergencies/attended-emergencies", {}, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            }
          })
        }

        if (response) setEmergencies(response.data);

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

    getEmergencies();
  }, [changeStatusEmergency, viewStatusEmergency]);

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (
    <>
      <Toast ref={toast} />
      <TableEmergencies
        data={emergencies}
        viewStatusEmergency={viewStatusEmergency}
        setViewStatusEmergency={setViewStatusEmergency}
        setChangeStatusEmergency={setChangeStatusEmergency}
        changeStatusEmergency={changeStatusEmergency}
      />
    </>
  )
}

export default Emergency;
