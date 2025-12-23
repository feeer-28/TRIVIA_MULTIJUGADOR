import { useEffect, useRef } from 'react';

/**
 * Hook para sincronizar el estado del servicio websocket con React
 * Con Socket.IO ya no se necesita sincronización local
 */
export function useSyncWebSocket() {
  const syncRef = useRef<number | null>(null);

  useEffect(() => {
    // No se necesita con Socket.IO - el servidor sincroniza todo
    
    return () => {
      if (syncRef.current) {
        clearInterval(syncRef.current);
      }
    };
  }, []);
}

export default useSyncWebSocket;