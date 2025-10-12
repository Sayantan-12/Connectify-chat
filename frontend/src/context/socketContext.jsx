import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const { authUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);

  useEffect(() => {
    if (!authUser) return;

    const newSocket = io("http://localhost:3000", {
      query: { userId: authUser._id },
    });

    console.log("Connecting socket for user:", authUser._id);

    newSocket.on("connect", () => console.log("Socket connected:", newSocket.id));

    newSocket.on("getOnlineUsers", (users) => setOnlineUser(users));

    const handleNewMessage = (message) => {
      console.log("New message received via socket:", message);
      setIncomingMessage(message);
    };

    newSocket.on("newMessage", handleNewMessage);

    setSocket(newSocket);

    return () => {
      newSocket.off("newMessage", handleNewMessage);
      newSocket.close();
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser, incomingMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
