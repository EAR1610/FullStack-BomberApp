import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequestAuth, socketIoURL } from "../../lib/apiRequest"
import { AuthContext } from "../../context/AuthContext"
import { AuthContextProps } from "../../interface/Auth"
import EmergencyModal from "../../components/Emergencies/EmergencyModal";
import EmergencyCard from "../../components/Emergencies/EmergencyCard";
import { Dropdown } from "primereact/dropdown"
import { EmergencyCardProps, ViewStatusEmergency } from "../../helpers/Interfaces";
import { io } from "socket.io-client";
import { Toast } from "primereact/toast";
import { handleErrorResponse } from "../../helpers/functions";


export const FirefighterEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState<any | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewStatusEmergency, setViewStatusEmergency] = useState<ViewStatusEmergency | null>(null);

  const navigate = useNavigate();

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken, updateToken } = authContext;
  const [errorMessages, setErrorMessages] = useState<string>('');

  const toast = useRef(null);

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
        } catch (err) {
          if(err.request.statusText === 'Unauthorized'){
            showAlert("error", "Sesion expirada", "Vuelve a iniciar sesion");
            setTimeout(() => {
              navigate('/login', { replace: true });
              updateToken('' as any);
            }, 1500);
          } else {
            showAlert('error', 'Error', handleErrorResponse(err, setErrorMessages));
          }
        }
    }

    getFirefighterEmergencies();
  }, [viewStatusEmergency]);

  
  useEffect(() => {
    const socket = io(socketIoURL, {
      query: { firefighterId: currentToken?.firefighter?.id }
    });
    
    socket.on('firefighterEmergencyCreated', () => {
      toast.current?.show({
        severity: 'info',
        summary: 'Nueva emergencia asignada',
        detail: `Se le ha asignado una nueva emergencia`,
      });
    });
    
    return () => {
      socket.disconnect();
    };
    
  }, []);

  useEffect(() => {
    const socket = io(socketIoURL, {
      query: { firefighterId: currentToken?.firefighter?.id }
    });
    
    socket.on('emergencyUpdatedForFirefighter', (updatedEmergency) => {   
      const statusMap = {
        "En proceso": 0,
        "Cancelada": 1,
        "Rechazada": 2,
        "Atendida": 3
      };
      const newStatusId = statusMap[updatedEmergency.status];

      if (newStatusId !== undefined) {
        const newStatus = emergencyTypes.find(type => type.id === newStatusId);
        if( newStatus ){
          toast.current?.show({
            severity: 'info',
            summary: 'Emergencia actualizada',
            detail: `La emergencia de ${updatedEmergency.applicant} ahora está en estado: ${updatedEmergency.status}`,
          });
          setViewStatusEmergency(newStatus);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [viewStatusEmergency]);


  const emergencyTypes = [
    { name: "En proceso", id: 0 },
    { name: "Canceladas", id: 1 },
    { name: "Rechazadas", id: 2 },
    { name: "Atendidas", id: 3 },
  ];
  
  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

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
              filter
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
          isFirefighter={currentToken.user.isFirefighter}
          isUser={currentToken.user.isUser}
        />
      </div>
    </>
  )
}
