import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import TableSupply from "../../components/Table/TableSupply";

const Supplies = () => {

    const [supplies, setSupplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewActiveSupplies, setViewActiveSupplies] = useState(true);
    const [isChangedSupply, setIsChangedSupply] = useState(false);

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;

    const navigate = useNavigate();
  
    const toast = useRef(null);

    useEffect(() => {

      if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
      if( currentToken?.user.isUser ) navigate('/app/emergency-request');
      
      const getEquipmentsType = async () => {
          try {
            let response;
            if (viewActiveSupplies) {
              response = await apiRequestAuth.get("/supply/", {
                headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
                },
              });
            } else {
              response = await apiRequestAuth.post("/supply/inactive-supplies", {}, {
                headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
                },
              });
            }
            if (response) setSupplies(response.data);
            setLoading(false);
          } catch (error) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los registros' });      
          }
      }

      getEquipmentsType()
    }, [isChangedSupply, viewActiveSupplies])


  return (
    <>
      <Toast ref={toast} />
      <TableSupply
        data={supplies}
        loading={loading} 
        viewActiveSupplies={viewActiveSupplies}
        setViewActiveSupplies={setViewActiveSupplies}
        isChangedSupply={isChangedSupply}
        setIsChangedSupply={setIsChangedSupply}
      />
    </>
  )
}

export default Supplies