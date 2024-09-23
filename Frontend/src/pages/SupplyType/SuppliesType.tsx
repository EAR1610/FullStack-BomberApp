import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import TableSupplyTypes from "../../components/Table/TableSupplyTypes";

const SuppliesType = () => {

    const [suppliesType, setSuppliesType] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewActiveSuppliesType, setViewActiveSuppliesType] = useState(true);
    const [isChangedSupplyType, setIsChangedSupplyType] = useState(false);

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
              if (viewActiveSuppliesType) {
                response = await apiRequestAuth.get("/supply-type/", {
                  headers: {
                    Authorization: `Bearer ${currentToken?.token}`,
                  },
                });
              } else {
                response = await apiRequestAuth.post("/supply-type/inactive-supply-types", {}, {
                  headers: {
                    Authorization: `Bearer ${currentToken?.token}`,
                  },
                });
              }
              if (response) setSuppliesType(response.data);
              setLoading(false);
            } catch (error) {
              toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los registros' });            
            }
        }
  
        getEquipmentsType()
      }, [isChangedSupplyType, viewActiveSuppliesType])

  return (
    <>
      <Toast ref={toast} />
      <TableSupplyTypes
        data={suppliesType}
        loading={loading} 
        viewActiveSuppliesType={viewActiveSuppliesType}
        setViewActiveSuppliesType={setViewActiveSuppliesType}
        isChangedSupplyType={isChangedSupplyType}
        setIsChangedSupplyType={setIsChangedSupplyType}
      />
    </>
  )
}

export default SuppliesType