import { useContext, useEffect, useRef, useState } from "react";
import { AuthContextProps } from "../../interface/Auth";
import { AuthContext } from "../../context/AuthContext";
import { apiRequestAuth, socketIoURL } from "../../lib/apiRequest";

import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";
import TableEmergencies from "../../components/Table/TableEmergencies";

import { io } from 'socket.io-client';

const Emergency = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [viewStatusEmergency, setViewStatusEmergency] = useState(0);
  const [changeStatusEmergency, setChangeStatusEmergency] = useState(false);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  const navigate = useNavigate();

  const toast = useRef(null);

  useEffect(() => {
    const getEmergencies = async () => {

      if( currentToken?.user.isFirefighter ) navigate('/app/firefighter-shift');
      if( currentToken?.user.isUser ) navigate('/app/emergency-request');

      try {
        let response;
        if (viewStatusEmergency === 0) {
          response = await apiRequestAuth.get("emergencies", {
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });          
        } else if (viewStatusEmergency === 1) {
          response = await apiRequestAuth.post("emergencies/in-process-emergencies", {},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            },
          });
        } else if (viewStatusEmergency === 2) {
          response = await apiRequestAuth.post("emergencies/cancelled-emergencies", {},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            }
          })
        } else if (viewStatusEmergency === 3) {
          response = await apiRequestAuth.post("emergencies/rejected-emergencies", {},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            }
          })
        } else if (viewStatusEmergency === 4) {
          response = await apiRequestAuth.post("emergencies/attended-emergencies", {},{
            headers: {
              Authorization: `Bearer ${currentToken?.token}`,
            }
          })
        }

        if (response) setEmergencies(response.data);

      } catch (error) {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Ha ocurrido un error al obtener los usuarios' });
      }
    }

    getEmergencies();
  }, [ changeStatusEmergency, viewStatusEmergency ]);
  
  // useEffect para configurar socket.io y escuchar eventos de emergencias
  useEffect(() => {
    // Connectar el WebSocket al servidor
    const socket = io(socketIoURL);

     // Listener the event 'emergencyCreated'
    socket.on('emergencyCreated', (newEmergency) => {
      console.log('Nueva emergencia creada:', newEmergency);

      // if viewStatusEmergency is not 0, set it to 0
      if (viewStatusEmergency !== 0) {
        setViewStatusEmergency(0); // changing viewStatusEmergency to 0
      }

      // Update the list of emergencies with the new emergency
      setEmergencies((prevEmergencies) => [newEmergency, ...prevEmergencies]);

      toast.current?.show({ severity: 'info', summary: 'Nueva emergencia', detail: 'Se ha creado una nueva emergencia' });
    });

    return () => {
      socket.disconnect(); // Desconectar el WebSocket cuando se desmonte el componente
    };
  }, [viewStatusEmergency]);

  const showAlert = (severity:string, summary:string, detail:string) => toast.current.show({ severity, summary, detail });

  return (
    <>
      <Toast ref={toast} />
      <TableEmergencies data={emergencies} viewStatusEmergency={viewStatusEmergency} setViewStatusEmergency={setViewStatusEmergency} setChangeStatusEmergency={setChangeStatusEmergency} changeStatusEmergency={changeStatusEmergency} />
    </>
  )
}

export default Emergency