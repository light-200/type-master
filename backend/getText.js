import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const CONSTANTS = {
  QUOTE_API_URL: process.env.QUOTE_API_URL || "https://api.quotable.io/random",
  LOG_PREVIEW_LENGTH: 50,
};

export default async function getText(io, room) {
  try {
    const res = await axios.get(CONSTANTS.QUOTE_API_URL);
    console.log(
      `[INFO] New text fetched for room ${room}: "${res.data.content.substring(0, CONSTANTS.LOG_PREVIEW_LENGTH)}..."`
    );
    io.to(room).emit("newText", res.data.content);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch text for room ${room}: ${error.message}`);
  }
}
