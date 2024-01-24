import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserInfoContext = createContext();

const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState();
  const [allUsers, setAllUsers] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(userDetail);
    if (!userDetail) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <UserInfoContext.Provider
      value={{ userInfo, setUserInfo, allUsers, setAllUsers }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export const UserInfoState = () => {
  return useContext(UserInfoContext);
};
export default UserInfoProvider;
