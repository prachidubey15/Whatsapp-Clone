import { createContext, useContext, useState } from "react";

const TypingContext = createContext();

const TypingProvider = ({ children }) => {
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // const [isTyping, setIsTyping] = useState({status:false,room:null});
  return (
    <TypingContext.Provider
      value={{
        typing,
        setTyping,
        isTyping,
        setIsTyping,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};

export const TypingState = () => {
  return useContext(TypingContext);
};

export default TypingProvider;
