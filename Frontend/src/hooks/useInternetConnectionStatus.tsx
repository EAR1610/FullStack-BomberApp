import { useEffect, useState } from 'react';

export enum ConnectionStatus {
  Online = 'online',
  Offline = 'offline',
}

export const useInternetConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(navigator.onLine ? ConnectionStatus.Online : ConnectionStatus.Offline);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setConnectionStatus(navigator.onLine ? ConnectionStatus.Online : ConnectionStatus.Offline);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const checkActiveInternetConnection = async () => {
    try {
      const response = await fetch('https://google.com', { method: 'HEAD', mode: 'no-cors' });
      if (response.ok || response.status === 0) {
        setConnectionStatus(ConnectionStatus.Online);
      } else {
        setConnectionStatus(ConnectionStatus.Offline);
      }
    } catch (_) {
      setConnectionStatus(ConnectionStatus.Offline);
    }
  };

  useEffect(() => {
    // Opcional: realizar chequeo activo de conexión cada 3 segundos
    const interval = setInterval(() => {
      checkActiveInternetConnection();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return connectionStatus;
};
