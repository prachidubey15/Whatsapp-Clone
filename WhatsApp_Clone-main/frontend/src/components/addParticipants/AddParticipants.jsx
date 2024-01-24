import React from "react";
import {  NewGroup,} from "../exportComponents";
import './style.scss';

const AddParticipants = () => {
  return (
    <div className="addParticipants">
      <div className="participantsWrapper">
        <NewGroup addParticipants={"ab"}/>
      </div>
    </div>
  );
};

export default AddParticipants;
