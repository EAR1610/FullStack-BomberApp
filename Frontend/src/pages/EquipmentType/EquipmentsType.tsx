import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import TableEquipmentTypes from "../../components/Table/TableEquipmentTypes";

const EquipmentsType = () => {

    const [equipmentsType, setEquipmentsType] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewActiveEquipmentsType, setViewActiveEquipmentsType] = useState(true);

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;
  
    const toast = useRef(null);

    useEffect(() => {
      const getEquipmentsType = async () => {
          try {
            let response;
            if (viewActiveEquipmentsType) {                
              response = await apiRequestAuth.get("/equipment-type/", {
                headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
                },
              });
            } else {
              response = await apiRequestAuth.post("/equipment-type/inactive-equipment-types", {}, {
                headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
                },
              });
            }
            if (response) setEquipmentsType(response.data);
            setLoading(false);
          } catch (error) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los registros' });            
          }
      }

      getEquipmentsType()
    }, [equipmentsType, viewActiveEquipmentsType])
    

  return (
    <>
      <Toast ref={toast} />
      <TableEquipmentTypes data={equipmentsType} loading={loading} viewActiveEquipmentsType={viewActiveEquipmentsType} setViewActiveEquipmentsType={setViewActiveEquipmentsType} />
    </>
  )
}

export default EquipmentsType