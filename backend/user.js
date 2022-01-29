const users = [];

const addUser = ({ id, name, progress, speed, room }) => {
  const user = { id, name, room, progress, speed };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

export { addUser, removeUser, getUser, getUsersInRoom };
