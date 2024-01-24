import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
const [allChatsSearch,setAllChatsSearch] = useState(false)
  return (
    <SearchContext.Provider
      value={{
        allChatsSearch,
        setAllChatsSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const SearchState = () => {
  return useContext(SearchContext);
};

export default SearchProvider;
