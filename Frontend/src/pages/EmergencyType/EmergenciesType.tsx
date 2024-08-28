import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import TableEmergencyTypes from "../../components/Table/TableEmergencyTypes";
import { useNavigate } from "react-router-dom";

const EmergenciesType = () => {

    const [emergenciesTypes, setEmergenciesTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewActiveEmergenciesType, setViewActiveEmergenciesType] = useState(true);
  
    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;

    const navigate = useNavigate();
  
    const toast = useRef(null);

    useEffect(() => {

      if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
      
      const getEmergenciesTypes = async () => {
        try {
          let response;
          if (viewActiveEmergenciesType) {
            response = await apiRequestAuth.get("/emergency-type", {
              headers: {
                Authorization: `Bearer ${currentToken?.token}`,
              },
            });
          } else {
            response = await apiRequestAuth.post(
              "/emergency-type/inactive-emergency-types",
              {},
              {
                headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
                },
              }
            );
          }
        if (response) setEmergenciesTypes(response.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
     }
        getEmergenciesTypes();
    }, [emergenciesTypes, viewActiveEmergenciesType])


  return (
    <>
      <Toast ref={toast} />
      <TableEmergencyTypes data = {emergenciesTypes} viewActiveEmergenciesType = {viewActiveEmergenciesType} setViewActiveEmergenciesType = {setViewActiveEmergenciesType} loading = {loading} />
    </>
  )
}

export default EmergenciesType