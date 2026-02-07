let smallCaseMode = false;
let punctuationMode = true;
let defaultTheme = "dark";
var multiplayerMode = false;
var isHost = false;

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
  setMultiplayerMode,
  multiplayerMode,
  setIsHost,
  isHost,
};
