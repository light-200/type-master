import { generateRandomText } from "./controllers/textController.js";

const CONSTANTS = {
  LOG_PREVIEW_LENGTH: 50,
  DEFAULT_WORD_COUNT: 25,
};

export default async function getText(io, room, settings) {
  try {
    const count = settings && settings.wordCount ? settings.wordCount : settings;
    let text = generateRandomText(count || CONSTANTS.DEFAULT_WORD_COUNT);
    if (settings && settings.punctuationMode === false) {
      text = text.replace(/[^ \\w]/g, "");
    }
    if (settings && settings.smallCaseMode === true) {
      text = text.toLowerCase();
    }
    console.log(
      `[INFO] New text fetched for room ${room}: "${text.substring(0, CONSTANTS.LOG_PREVIEW_LENGTH)}..."`
    );
    io.to(room).emit("newText", text);
  } catch (error) {
    console.error(`[ERROR] Failed to fetch text for room ${room}: ${error.message}`);
  }
}
