const users = new Map();

const addUser = ({ id, name, progress, speed, room }) => {
  const user = { id, name, room, progress, speed };

  users.set(id, user);
  return { user };
};

const removeUser = (id) => {
  let user = users.get(id);
  users.delete(id);
  if (user) return user.value;
};

const getUser = (id) => {
  return users.get(id);
};

const setUser = (user) => {
  if (users.get(user.id).progress <= user.progress) {
    users.set(user.id, user);
  } else if (user.progress > 100 || user.progress < 0) {
    return;
  }
};

const getUsersInRoom = (room) => {
  let usersInRoom = new Array();
  users.forEach((user) => {
    if (user.room == room) usersInRoom.push(user);
  });
  return usersInRoom;
};

const resetUser = (room) => {
  let usersInRoom = new Array();
  users.forEach((user) => {
    if (user.room == room) {
      let tempUser = {
        id: user.id,
        name: user.name,
        room: user.room,
        progress: 0,
        speed: 0,
      };
      users.set(user.id, tempUser);
      usersInRoom.push(tempUser);
    }
  });
  return usersInRoom;
};

export { addUser, removeUser, getUser, getUsersInRoom, setUser, resetUser };
