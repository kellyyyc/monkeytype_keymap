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

chrome.runtime.onInstalled.addListener(() => {
  const key_mappings = {};
  for (const key of ALL_KEYS) {
    key_mappings[key] = { text_color: "#d1d0c5", bg_color: "#2c2e31" };
  }
  chrome.storage.sync.set({ monkeytype_keymap_keys: key_mappings });
});
