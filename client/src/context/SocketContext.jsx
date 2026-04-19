import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        query: { userId: user._id },
        withCredentials: true
      });

      newSocket.on('incoming_request', (data) => {
        setNotifications((prev) => prev + 1);
        toast('New Flatmate Request!', { icon: '🔔' });
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
