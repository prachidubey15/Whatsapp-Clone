import { createContext, useContext, useState } from "react";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [passSocket, setPassSocket] = useState();
  var socket;
  return (
    <SocketContext.Provider
      value={{
        socketConnected,
        setSocketConnected,
        passSocket,
        setPassSocket,
        socket
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const SocketState = () => {
  return useContext(SocketContext);
};

export default SocketProvider;
