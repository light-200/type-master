import axios from "axios";

export default async function getText(io, room) {
  try {
    const res = await axios.get("https://api.quotable.io/random");
    io.to(room).emit("newText", res.data.content);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
