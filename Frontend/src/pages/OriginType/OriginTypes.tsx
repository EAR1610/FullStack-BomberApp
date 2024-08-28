import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import TableOriginTypes from "../../components/Table/TableOriginTypes";
import { useNavigate } from "react-router-dom";

const OriginTypes = () => {

  const [originTypes, setOriginTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewActiveOriginTypes, setViewActiveOriginTypes] = useState(true);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const navigate = useNavigate();

  const toast = useRef(null);

  useEffect(() => {

    if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
    
    const getOriginTypes = async () => {
      try {
        let response;
        if (viewActiveOriginTypes) {
          response = await apiRequestAuth.get("/origin-type", {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        } else {
          response = await apiRequestAuth.post("/origin-type/inactive-origin-types", {}, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        }
        if (response) setOriginTypes(response.data);
        setLoading(false);
      } catch (error) {
          toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los tipos de origen' });
      }
    };
    getOriginTypes();
  }, [originTypes, viewActiveOriginTypes]);

  return (
    <>
      <Toast ref={toast} />
      <TableOriginTypes data={originTypes} viewActiveOriginTypes={viewActiveOriginTypes} setViewActiveOriginTypes={setViewActiveOriginTypes} loadin={loading} />
    </>
  )
}

export default OriginTypes