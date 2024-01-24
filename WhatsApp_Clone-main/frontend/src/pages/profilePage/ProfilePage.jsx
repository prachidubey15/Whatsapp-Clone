import React from "react";
import { Profile } from "../../components/exportComponents";
import UserInfoProvider from "../../context/UserInfoContext";
import ChatProvider from "../../context/ChatContext";
import SearchProvider from "../../context/SearchContext";
import { useLocation } from "react-router-dom";

const ProfilePage = () => {
    const location =  useLocation();
  return (
    <UserInfoProvider>
      <ChatProvider>
        <SearchProvider>
          <div
            style={{
              height: "100vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                boxShadow: "-1px 0px 24px -4px rgba(0,0,0,0.87)",
              }}
            >
              <Profile location={location} />
            </div>
          </div>
        </SearchProvider>
      </ChatProvider>
    </UserInfoProvider>
  );
};

export default ProfilePage;
