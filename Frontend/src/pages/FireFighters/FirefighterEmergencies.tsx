import { useContext, useEffect, useState } from "react";
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"

import EmergencyModal from "../../components/Emergencies/EmergencyModal";
import EmergencyCard from "../../components/Emergencies/EmergencyCard";


export const FirefighterEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState<any | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewStatusEmergency, setViewStatusEmergency] = useState(0);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  useEffect(() => {
    const getFirefighterEmergencies = async () => {
        try {
            let response;
            if (viewStatusEmergency === 0) {
              response = await apiRequestAuth.get(`/firefighter-emergency/in-process-emergencies/${currentToken?.firefighter?.id}`, {
                 headers: {
                     Authorization: `Bearer ${currentToken?.token}`,
                 },
             })              
            } else if (viewStatusEmergency === 1) {
              response = await apiRequestAuth.get(`/firefighter-emergency/cancelled-emergencies/${currentToken?.firefighter?.id}`, {
                 headers: {
                     Authorization: `Bearer ${currentToken?.token}`,
                 },
             })
            } else if (viewStatusEmergency === 2) {
              response = await apiRequestAuth.get(`/firefighter-emergency/rejected-emergencies/${currentToken?.firefighter?.id}`, {
                 headers: {
                     Authorization: `Bearer ${currentToken?.token}`,
                 },
             })
            } else if (viewStatusEmergency === 3) {
              response = await apiRequestAuth.get(`/firefighter-emergency/attended-emergencies/${currentToken?.firefighter?.id}`, {
                 headers: {
                     Authorization: `Bearer ${currentToken?.token}`,
                 },
             })
            }
            if (response) setEmergencies(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    getFirefighterEmergencies();
  }, []);
  

  const openModal = (emergency: any) => {
    setSelectedEmergency(emergency);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmergency(null);
    setModalOpen(false);
  }; 

  return (
    <div className="p-4">
      {emergencies.map((emergency, index) => (
        <EmergencyCard
          key={index}
          applicant={emergency?.emergency.applicant}
          address={emergency?.emergency.address}
          description={emergency.emergency?.description}
          onShowDetails={() => openModal(emergency)}
        />
      ))}

      <EmergencyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        emergencyData={selectedEmergency}
      />
    </div>
  )
}
