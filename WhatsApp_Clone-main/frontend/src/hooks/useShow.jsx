import { useContext } from "react";
import ShowContext from "../context/ShowContext.jsx";

 const useShow = ()=>(useContext(ShowContext));

 export default useShow;