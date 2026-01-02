const ALL_KEYS = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "[",
  "]",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  "'",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  ".",
  "/",
  "spacebar",
];

const DEFAULT_TEXT_COLOR = "#646669";
const DEFAULT_BG_COLOR = "#2c2e31";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ keymap_enabled: true });

  const keyMappings = {};
  for (const key of ALL_KEYS) {
    keyMappings[key] = {
      text_color: DEFAULT_TEXT_COLOR,
      bg_color: DEFAULT_BG_COLOR,
    };
  }
  chrome.storage.sync.set({ keymap_keys: keyMappings });
});
