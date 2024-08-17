import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth } from "../../lib/apiRequest";
import { Toast } from 'primereact/toast';
import TableVehicleTypes from "../../components/Table/TableVehicleTypes";

const VehiclesType = () => {

  const [vehiclesTypes, setVehiclesTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewActiveVehiclesType, setViewActiveVehiclesType] = useState(true);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null);

  useEffect(() => {
    const getVehiclesTypes = async () => {
      try {
        let response;
        if (viewActiveVehiclesType) {
          response = await apiRequestAuth.get("/vehicle-type", {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`
            }
          });
        } else {
          response = await apiRequestAuth.post("/vehicle-type/inactive-vehicle-types", {}, {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`
            }
          });
        }
        if (response) setVehiclesTypes(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    getVehiclesTypes();
  }, [vehiclesTypes, viewActiveVehiclesType])


  return (
    <>
      <Toast ref={toast} />
      <TableVehicleTypes data = {vehiclesTypes} viewActiveVehiclesType = {viewActiveVehiclesType} setViewActiveVehiclesType = {setViewActiveVehiclesType} loading = {loading} />
    </>
  )
}

export default VehiclesType