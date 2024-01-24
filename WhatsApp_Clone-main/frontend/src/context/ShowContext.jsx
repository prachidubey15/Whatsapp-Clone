import { createContext, useContext, useState } from "react";

const ShowContext = createContext();

const ShowProvider = ({ children }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showOpenChat, setShowOpenChat] = useState(false);
  const [showDeleteChat, setShowDeleteChat] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showExitGroup, setShowExitGroup] = useState(false);
  const [showCreateNewGroup, setShowCreateNewGroup] = useState(false);
  const [showGroupOption, setShowGroupOption] = useState(false);
  const [showAddParticipants, setShowAddParticipants] = useState(false);

  return (
    <ShowContext.Provider
      value={{
        showProfile,
        setShowProfile,
        showSetting,
        setShowSetting,
        showLogout,
        setShowLogout,
        showNewMessage,
        setShowNewMessage,
        showNewGroup,
        setShowNewGroup,
        showContactInfo,
        setShowContactInfo,
        showBlock,
        setShowBlock,
        showDeleteChat,
        setShowDeleteChat,
        showOpenChat,
        setShowOpenChat,
        showExitGroup,
        setShowExitGroup,
        showCreateNewGroup,
        setShowCreateNewGroup,
        showGroupOption,
        setShowGroupOption,
        showAddParticipants,
        setShowAddParticipants,
      }}
    >
      {children}
    </ShowContext.Provider>
  );
};

export const ShowStates = () => {
  return useContext(ShowContext);
};

export default ShowProvider;
