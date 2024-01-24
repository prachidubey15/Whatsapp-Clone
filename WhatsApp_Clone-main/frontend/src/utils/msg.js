export const timeGenerator = (msgTimestamp) => {
  const time = new Date(msgTimestamp).toLocaleTimeString().split(" ");
  const timearr = time[0].split(":");

  return `${timearr[0]}:${timearr[1]} ${time[1]}`;
};

export const lastMsgTime = (msgTimestamp,divider) => {
  const currDate = new Date().toLocaleDateString().split("/");
  const time = new Date(msgTimestamp);
  const msgDate = new Date(msgTimestamp).toLocaleDateString().split("/");
  const chatDate = new Date(msgTimestamp).toLocaleDateString();
  const day = currDate[0] - +msgDate[0];
  const month = currDate[1] - +msgDate[1];
  const year = currDate[2] - +msgDate[2];

  // console.log(msgTimestamp);
  if (day === 0 && month === 0 && year ===0) {
    return divider ? "Today":timeGenerator(msgTimestamp);
  } else if (day === 1 && month === 0 && year ===0) return "Yesterday";
  else if (day < 8 && month === 0 && year ===0) return time.getDay();
  else return chatDate;
};

export const msgTimeDivider = (arr,index)=>{
  if(index === 0) return lastMsgTime(arr[0].createdAt);
  else {
  const currentMsgTimestamps = arr[index].createdAt;
  const previousMsgTimestamps = arr[index-1].createdAt;
  const currentMsgDate = new Date(currentMsgTimestamps).toLocaleDateString().split("/");
  const previousMsgDate = new Date(previousMsgTimestamps).toLocaleDateString().split("/");
  const day = currentMsgDate[0] - +previousMsgDate[0];
  if(day>0) return lastMsgTime(arr[index].createdAt,"divider");
  else return

  };
}