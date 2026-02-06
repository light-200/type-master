import axios from "axios";

export default async function getText(io, room) {
  try {
    const res = await axios.get("https://api.quotable.io/random");
    console.log(`[INFO] New text fetched for room ${room}: "${res.data.content.substring(0, 50)}..."`);
    io.to(room).emit("newText", res.data.content);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch text for room ${room}: ${error.message}`);
  }
}
