import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import TableVehicles from "../../components/Table/TableVehicles";

const Vehicles = () => {

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewActiveVehicles, setViewActiveVehicles] = useState(true);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null);

  useEffect(() => {
    const getVehicles = async () => {
      try {
        let response;
        if (viewActiveVehicles) {
          response = await apiRequestAuth.get("/vehicle", {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        } else {
          response = await apiRequestAuth.post("/vehicle/inactive-vehicles", {}, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        }
        if (response) setVehicles(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getVehicles();
  }, [vehicles, setViewActiveVehicles])  

  return (
    <>
      <Toast ref={toast} />
      <TableVehicles data={vehicles} loading={loading} viewActiveVehicles={viewActiveVehicles} setViewActiveVehicles={setViewActiveVehicles} />
    </>
  )
}

export default Vehicles