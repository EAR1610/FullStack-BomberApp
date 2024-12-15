import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { io } from 'socket.io-client';
import { Toast } from 'primereact/toast';
import { socketIoURL } from '../lib/apiRequest';
import { AuthContextProps } from '../interface/Auth';
import { AuthContext } from './AuthContext';

const EmergencyContext = createContext<any>(null);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [viewStatusEmergency, setViewStatusEmergency] = useState(0);
  const toast = useRef<Toast>(null);

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);
  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");
  const { currentToken } = authContext;

  useEffect(() => {
    const socket = io(socketIoURL);

    const handleUserActivity = () => {
      stopAlertSound();
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };

    socket.on('emergencyCreated', (newEmergency) => {
      console.log(currentToken);
      if( currentToken.user.isAdmin ) {
        playAlertSound();
  
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);
  
        setEmergencies((prevEmergencies) => [newEmergency, ...prevEmergencies]);
        toast.current?.show({
          severity: 'info',
          summary: 'Nueva emergencia',
          detail: 'Se ha creado una nueva emergencia',
          life: 5000,
          closable: true,
        });
      }
      if (viewStatusEmergency !== 0) setViewStatusEmergency(0);
    });

    return () => {
      socket.disconnect();
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, []);

  const alertSound = new Howl({
    src: ['/music/EmergencyAlert.mp3'],
    volume: 1.0,
    loop: true,
  });

  const playAlertSound = () => {
    if (!alertSound.playing()) {
      alertSound.play();
    }
  };

  const stopAlertSound = () => {
    alertSound.stop();
  };

  return (
    <EmergencyContext.Provider 
        value={{
            emergencies,
            setEmergencies,
            viewStatusEmergency,
            setViewStatusEmergency,
        }}
    >
      <Toast ref={toast} />
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => useContext(EmergencyContext);
