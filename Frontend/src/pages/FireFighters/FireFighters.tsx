import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import TableFirefighters from "../../components/Table/TableFirefighters";
import { useNavigate } from "react-router-dom";
import { handleErrorResponse } from "../../helpers/functions";


const FireFighters = () => {
    const [firefighters, setFirefighters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewActiveFirefighters, setViewActiveFirefighters] = useState(true);
    const [isChangedFirefighter, setIsChangedFirefighter] = useState(false);
  
    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
    const [errorMessages, setErrorMessages] = useState<string>('');

    const navigate = useNavigate();  
    const toast = useRef(null);

    useEffect(() => {

      if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
      if( currentToken?.user.isUser ) navigate('/app/emergency-request');
      
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
            showAlert('error', 'Error', handleErrorResponse(error, setErrorMessages));
          }
      }

      getFirefighters()
    }, [isChangedFirefighter, viewActiveFirefighters])
    
    const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });
    
  return (
    <>
      <Toast ref={toast} />
      <TableFirefighters 
          data={firefighters} 
          loading={loading} 
          setViewActiveFirefighters={setViewActiveFirefighters} 
          viewActiveFirefighters={viewActiveFirefighters} 
          isChangedFirefighter={isChangedFirefighter}
          setIsChangedFirefighter={setIsChangedFirefighter}
      />
    </>
  )
}

export default FireFighters