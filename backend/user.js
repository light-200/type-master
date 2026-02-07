const users = new Map();

const addUser = ({ id, name, progress, speed, room }) => {
  const user = { id, name, room, progress, speed };
  console.log(`[INFO] User added: ${name} (ID: ${id}) to room: ${room}`);
  users.set(id, user);
  return { user };
};

const removeUser = (id) => {
  let user = users.get(id);
  if (user) {
    console.log(`[INFO] User removed: ${user.name} (ID: ${id}) from room: ${user.room}`);
  }
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
    console.log(`[INFO] Invalid progress value for user ${user.name}: ${user.progress}%`);
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

const getUserCount = () => users.size;

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

export { addUser, removeUser, getUser, getUsersInRoom, getUserCount, setUser, resetUser };
