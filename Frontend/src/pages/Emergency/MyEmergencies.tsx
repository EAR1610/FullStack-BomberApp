import { useContext, useEffect, useState } from "react";
import { apiRequestAuth } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";
import { useNavigate } from 'react-router-dom';
import { Dropdown } from "primereact/dropdown"
import MyEmergencyCard from "../../components/Emergencies/MyEmergencyCard";
import MyEmergencyModal from "../../components/Emergencies/MyEmergencyModal";
import { EmergencyCardProps, ViewStatusEmergency } from "../../helpers/Interfaces";

const MyEmergencies = () => {
  const [myEmergencies, setMyEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewStatusEmergency, setViewStatusEmergency] = useState<ViewStatusEmergency | null>(null);

  const navigate = useNavigate();

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  useEffect(() => {
    
    if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
    if( currentToken?.user.isAdmin ) navigate('/app/dashboard');

    const getMyEmergencies = async () => {
      try {
        let response;
        if (viewStatusEmergency?.id === 0) {
          response = await apiRequestAuth.post(`/emergencies/my-emergencies/in-registered-emergencies/${currentToken?.user?.id}`, { },{
              headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
              },
          })              
        } else if (viewStatusEmergency?.id === 1) {
          response = await apiRequestAuth.post(`/emergencies/my-emergencies/in-process-emergencies/${currentToken?.user?.id}`, { }, {
              headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
              },
          })
        } else if (viewStatusEmergency?.id === 2) {
          response = await apiRequestAuth.post(`/emergencies/my-emergencies/cancelled-emergencies/${currentToken?.user?.id}`, { }, {
              headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
              },
          })
        } else if (viewStatusEmergency?.id === 3) {
          response = await apiRequestAuth.post(`/emergencies/my-emergencies/rejected-emergencies/${currentToken?.user?.id}`, { }, {
              headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
              },
          })
        } else if (viewStatusEmergency?.id === 4) {
          response = await apiRequestAuth.post(`/emergencies/my-emergencies/attended-emergencies/${currentToken?.user?.id}`, { }, {
              headers: {
                  Authorization: `Bearer ${currentToken?.token}`,
              },
          })
        }        
        if(response) setMyEmergencies(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMyEmergencies();
  }, [viewStatusEmergency]);

  const emergencyTypes = [
    { name: "Registradas", id: 0 },
    { name: "En proceso", id: 1 },
    { name: "Canceladas", id: 2 },
    { name: "Rechazadas", id: 3 },
    { name: "Atendidas", id: 4 },
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
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
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
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myEmergencies.map((myEmergency: EmergencyCardProps, index) => (
            <MyEmergencyCard
              key={index}
              applicant={ myEmergency?.applicant }
              address={ myEmergency?.address }
              description={ myEmergency?.description }
              user={ myEmergency?.user }
              onShowDetails={() => openModal(myEmergency)}
            />
          ))}
        </div>

        <MyEmergencyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          emergencyData={selectedEmergency}
        />
      </div>
    </>
  );
};

export default MyEmergencies;
