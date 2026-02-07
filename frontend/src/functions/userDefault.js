let smallCaseMode = false;
let punctuationMode = true;
let defaultTheme = "dark";
const WORD_COUNT_OPTIONS = [10, 25, 50, 100];
const DEFAULT_WORD_COUNT = 25;
var multiplayerMode = false;
var isHost = false;

function normalizeWordCount(value) {
  const parsed = parseInt(value, 10);
  return WORD_COUNT_OPTIONS.includes(parsed)
    ? parsed
    : DEFAULT_WORD_COUNT;
}

function setMultiplayerMode(bool) {
  multiplayerMode = bool;
}
function setSmallCaseMode(bool) {
  smallCaseMode = bool;
}
function setPunctuationMode(bool) {
  punctuationMode = bool;
}
function setIsHost(bool) {
  isHost = bool;
}

export {
  setSmallCaseMode,
  smallCaseMode,
  setPunctuationMode,
  punctuationMode,
  defaultTheme,
  WORD_COUNT_OPTIONS,
  DEFAULT_WORD_COUNT,
  normalizeWordCount,
  setMultiplayerMode,
  multiplayerMode,
  setIsHost,
  isHost,
};
