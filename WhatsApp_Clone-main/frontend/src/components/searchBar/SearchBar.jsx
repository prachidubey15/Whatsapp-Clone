import React, { useState } from "react";
import "./style.scss";

import { AiOutlineSearch } from "react-icons/ai";
import { HiArrowLeft } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import throttle from "../../utils/throttle";
import { SearchState } from "../../context/SearchContext";

const SearchBar = ({ find, searchState }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();
    setSearch(e.target.value)
    e.target.value ==="" ? searchState(false):searchState(true)
    if (search.trim().length > 0) {
      throttle(find(search), 1000);
    }
  };
  // const handleKeyDown = (e) =>{
  //   // console.log(e.keyCode);
  //   if(e.keyCode === 13 && search.trim().length>0) find(search);
  // }
  return (
    <>
      <div className="searchBarWrapper">
        {isFocused ? (
          <HiArrowLeft color={"var(--bgGreen)"} />
        ) : (
          <AiOutlineSearch fontSize={"1.1rem"} color={"var(--lighttext)"} />
        )}
        <input
          type="text"
          name="searchUser"
          placeholder="Search or start new chat"
          value={search}
          onChange={handleChange}
          // onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {search ? (
          <RxCross2
            onClick={() => setSearch("")}
            cursor={"pointer"}
            fontSize={"1rem"}
            color={"var(--lighttext)"}
          />
        ) : null}
        {/*Display when input has some value*/}
      </div>
    </>
  );
};

export default SearchBar;
