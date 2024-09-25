import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import { apiRequestAuth } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";
import MySuppliesCard from "../../components/Emergencies/MySuppliesCard";

const SuppliesEmergency = ({ emergencyId }: any) => {
    const [suppliesPerEmergency, setSuppliesPerEmergency] = useState([]);

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;

    const toast = useRef(null);

    useEffect(() => {
        const getToolsPerEmergencyType = async () => {
            try {
                const response = await apiRequestAuth.post(`/supply-emergency/supplies-per-emergency/${emergencyId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${currentToken?.token}`
                    }
                });
                if (response) setSuppliesPerEmergency(response.data);
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        getToolsPerEmergencyType();
    }, []);

    return (
        <>
            <Toast ref={toast} />
            <div className="space-y-6">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {suppliesPerEmergency.map((supplyPerEmergency: any, index) => (
                        <MySuppliesCard
                            key={index}
                            name={supplyPerEmergency?.supply.name}
                            quantity={supplyPerEmergency?.quantity}
                        />
                    ))}
                    </div>
                </div>                
            </div>
        </>
    )
}

export default SuppliesEmergency