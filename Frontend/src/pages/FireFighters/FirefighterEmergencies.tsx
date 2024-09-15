import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequestAuth } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import EmergencyModal from "../../components/Emergencies/EmergencyModal";
import EmergencyCard from "../../components/Emergencies/EmergencyCard";
import { Dropdown } from "primereact/dropdown"
import { EmergencyCardProps, ViewStatusEmergency } from "../../helpers/Interfaces";


export const FirefighterEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState<any | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewStatusEmergency, setViewStatusEmergency] = useState<ViewStatusEmergency | null>(null);

  const navigate = useNavigate();

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  useEffect(() => {

    if( currentToken?.user.isUser ) navigate('/app/emergency-request');
    if( currentToken?.user.isAdmin ) navigate('/app/dashboard');
    
    const getFirefighterEmergencies = async () => {
        try {
            let response;
            if (viewStatusEmergency?.id === 0) {
              response = await apiRequestAuth.post(`/firefighter-emergency/in-process-emergencies/${currentToken?.firefighter?.id}`, { },{
                 headers: {
                     Authorization: `Bearer ${currentToken?.token}`,
                 },
             })              
            } else if (viewStatusEmergency?.id === 1) {
              response = await apiRequestAuth.post(`/firefighter-emergency/cancelled-emergencies/${currentToken?.firefighter?.id}`, { }, {
                 headers: {
                     Authorization: `Bearer ${currentToken?.token}`,
                 },
             })
            } else if (viewStatusEmergency?.id === 2) {
              response = await apiRequestAuth.post(`/firefighter-emergency/rejected-emergencies/${currentToken?.firefighter?.id}`, { }, {
                 headers: {
                     Authorization: `Bearer ${currentToken?.token}`,
                 },
             })
            } else if (viewStatusEmergency?.id === 3) {
              response = await apiRequestAuth.post(`/firefighter-emergency/attended-emergencies/${currentToken?.firefighter?.id}`, { }, {
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
  }, [viewStatusEmergency]);

  const emergencyTypes = [
    { name: "En proceso", id: 0 },
    { name: "Canceladas", id: 1 },
    { name: "Rechazadas", id: 2 },
    { name: "Atendidas", id: 3 },
  ];
  

  const openModal = (emergency: any) => {
    setSelectedEmergency(emergency);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmergency(null);
    setModalOpen(false);
  }; 

  return (
    <>    
      <div className="space-y-6">      
        <div className="mb-6">
          <label className="mb-2 block text-lg font-semibold text-gray-700 dark:text-gray-300">
            Tipo de emergencia
          </label>
          <div className="relative">
            <Dropdown
              value={viewStatusEmergency}
              options={emergencyTypes}
              onChange={(e) => setViewStatusEmergency(e.value)}
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione el tipo de emergencia"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {emergencies.map((emergency: EmergencyCardProps, index) => (
              <EmergencyCard
                key={index}
                applicant={emergency?.emergency.applicant}
                address={emergency?.emergency.address}
                description={emergency?.emergency.description}
                user={emergency?.firefighter?.user}
                onShowDetails={() => openModal(emergency)}
              />
            ))}
          </div>
        </div>

        <EmergencyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          emergencyData={selectedEmergency}
        />
      </div>

    </>
  )
}
