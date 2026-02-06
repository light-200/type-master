import { COMMON_WORDS } from "../data/words.js";

const CONSTANTS = {
  DEFAULT_WORD_COUNT: 50,
  MIN_WORD_COUNT: 1,
  MAX_WORD_COUNT: 200,
};

/**
 * Generate random text from common English words
 * @param {number} wordCount - Number of words to generate (default: 50)
 * @returns {string} Random text with specified number of words
 */
export function generateRandomText(wordCount = CONSTANTS.DEFAULT_WORD_COUNT) {
  // Validate and constrain word count
  let count = parseInt(wordCount, 10);
  
  if (isNaN(count)) {
    count = CONSTANTS.DEFAULT_WORD_COUNT;
  }
  
  count = Math.max(CONSTANTS.MIN_WORD_COUNT, Math.min(count, CONSTANTS.MAX_WORD_COUNT));
  
  const words = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
    words.push(COMMON_WORDS[randomIndex]);
  }
  
  // Capitalize first letter
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export { CONSTANTS as TEXT_CONSTANTS };
