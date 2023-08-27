export const getSender = (loggedUser, users) => {
    return loggedUser?.id === users[0]?.id  ? users[1].name : users[0].name;
  };