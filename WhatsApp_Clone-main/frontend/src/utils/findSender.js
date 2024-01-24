export const findSenderName = (users, loggedInUser) =>
  String(users[0]._id) === String(loggedInUser) ? users[1].userName : users[0].userName;

export const findSenderDp = (users, loggedInUser) =>
  String(users[0]._id) === String(loggedInUser) ? users[1].profilePic : users[0].profilePic;
  
export const findSender = (users, loggedInUser) =>
  String(users[0]._id) === String(loggedInUser) ? users[1] : users[0];
