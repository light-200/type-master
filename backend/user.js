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

const setUser = (id, speed, progress) => {
  let user = users.get(id);
  users.set(id, { ...user, speed, progress });
};

const getUsersInRoom = (room) => {
  let usersInRoom = new Array();
  users.forEach((user) => {
    if (user.room == room) usersInRoom.push(user);
  });
  return usersInRoom;
};

export { addUser, removeUser, getUser, getUsersInRoom, setUser };
