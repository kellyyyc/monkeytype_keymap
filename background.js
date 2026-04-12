import {
  ALL_KEYS,
  DEFAULT_TEXT_COLOR,
  DEFAULT_BG_COLOR,
} from "./utils/constants.js";

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
