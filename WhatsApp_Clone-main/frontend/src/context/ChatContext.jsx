import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [sender, setSender] = useState();
  const [allChats, setAllChats] = useState();
  const [chatName, setChatName] = useState();
  const [allMessages,setAllMessages] = useState();
  const [notification,setNotification] = useState(new Map());
  const [notificationChat,setNotificationChat] = useState([]);
  return (
    <ChatContext.Provider
      value={{
        sender,
        setSender,
        allChats,
        setAllChats,
        chatName,
        setChatName,
        allMessages,
        setAllMessages,
        notification,
        setNotification,
        notificationChat,
        setNotificationChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
