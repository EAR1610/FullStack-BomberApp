import { useContext, useEffect, useRef, useState } from "react";
import { apiRequestAuth, socketIoURL } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";
import { useNavigate } from 'react-router-dom';
import { Dropdown } from "primereact/dropdown"
import MyEmergencyCard from "../../components/Emergencies/MyEmergencyCard";
import MyEmergencyModal from "../../components/Emergencies/MyEmergencyModal";
import { EmergencyCardProps, ViewStatusEmergency } from "../../helpers/Interfaces";

import { io } from 'socket.io-client';
import { Toast } from "primereact/toast";

const MyEmergencies = () => {
  const [myEmergencies, setMyEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewStatusEmergency, setViewStatusEmergency] = useState<ViewStatusEmergency | null>(null);

  const navigate = useNavigate();

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const toast = useRef(null);

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

  useEffect(() => {
    const socket = io(socketIoURL,{
      query: { userId: currentToken?.user.id }
    });

    socket.on('emergencyUpdated', (updatedEmergency) => {

      const statusMap = {
        "Registrada": 0,
        "En proceso": 1,
        "Cancelada": 2,
        "Rechazada": 3,
        "Atendida": 4
      };

      const newStatusId = statusMap[updatedEmergency.status];

      if (newStatusId !== undefined) {
        const newStatus = emergencyTypes.find(type => type.id === newStatusId);
        if (newStatus) {
          setViewStatusEmergency(newStatus);
          toast.current?.show({ severity: 'info', summary: 'Emergencia actualizada', detail: `La emergencia está ahora en estado: ${newStatus.name}` });
        }
      }
    })

    return () => {
      socket.disconnect();
    };

  }, [viewStatusEmergency])
  

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
      <Toast ref={toast} />
      <div className="space-y-6">
          {/* Dropdown de tipo de emergencia */}
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
              {myEmergencies.map((myEmergency: EmergencyCardProps, index) => (
                <MyEmergencyCard
                  key={index}
                  applicant={myEmergency?.applicant}
                  address={myEmergency?.address}
                  description={myEmergency?.description}
                  user={myEmergency?.user}
                  onShowDetails={() => openModal(myEmergency)}
                />
              ))}
            </div>
          </div>

          {/* Modal de emergencia */}
          <MyEmergencyModal
            isOpen={isModalOpen}
            onClose={closeModal}
            emergencyData={selectedEmergency}
            isUser={currentToken?.user.isUser}
          />
      </div>
    </>
  );
};

export default MyEmergencies;
