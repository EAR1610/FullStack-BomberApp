import { Toast } from "primereact/toast";
import { useContext, useEffect, useRef, useState } from "react";
import { ToolPerEmergencyTypeProps } from "../../helpers/Interfaces";
import MyToolsCard from "../../components/Emergencies/MyToolsCard";
import { apiRequestAuth } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";

const ToolsPerEmergency = ({ emergencyTypeId }: any) => {
    const [toolsPerEmergencyType, setToolsPerEmergencyType] = useState([]);

    const authContext = useContext<AuthContextProps | undefined>(AuthContext);
    if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
    const { currentToken } = authContext;

    const toast = useRef(null);
    useEffect(() => {
        const getToolsPerEmergencyType = async () => {
            try {
                const response = await apiRequestAuth.post(`/tool/tools-per-emergency-type/${emergencyTypeId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${currentToken?.token}`
                    }
                });
                if (response) setToolsPerEmergencyType(response.data);
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
                    {toolsPerEmergencyType.map((toolPerEmergencyType: ToolPerEmergencyTypeProps, index) => (
                        <MyToolsCard
                            key={index}
                            name={toolPerEmergencyType?.name}
                            brand={toolPerEmergencyType?.brand}
                            model={toolPerEmergencyType?.model}
                        />
                    ))}
                    </div>
                </div>                
            </div>
        </>
    )
}

export default ToolsPerEmergency