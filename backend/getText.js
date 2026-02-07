import { generateRandomText } from "./controllers/textController.js";

const CONSTANTS = {
  LOG_PREVIEW_LENGTH: 50,
  DEFAULT_WORD_COUNT: 25,
};

export default async function getText(io, room, wordCount) {
  try {
    const text = generateRandomText(wordCount || CONSTANTS.DEFAULT_WORD_COUNT);
    console.log(
      `[INFO] New text fetched for room ${room}: "${text.substring(0, CONSTANTS.LOG_PREVIEW_LENGTH)}..."`
    );
    io.to(room).emit("newText", text);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch text for room ${room}: ${error.message}`);
  }
}
