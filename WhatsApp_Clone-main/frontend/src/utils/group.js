export const findAdmin = (id,admins)=>{
    return (admins?.findIndex(admin => (String(admin._id)=== String(id))));
}

export const participantsName = (participants)=>{
    return participants?.map((participant,index) => {
                  let name = participant.userName; 
                  if(index<participants.length-1) {name += ", "}
                  return name
    })
}

export const extractUsersId = (details)=>{
    return details?.map(user=>(user._id))
}

export const uniqueUser = (id,users)=>{
    return users.findIndex(user=>(String(user._id)===String(id)))
}

export const showFirstDp = (allMessages,index)=>{
    if (allMessages.length > 1 && index>0) {
        if(String(allMessages[index].sender._id) ===
          String(allMessages[index-1].sender._id)) return false;
          else return true;
    }else return true;
}