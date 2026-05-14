import {
  ALL_KEYS,
  DEFAULT_TEXT_COLOR,
  DEFAULT_BG_COLOR,
} from "../utils/constants.js";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(
    [
      "keymap_enabled",
      "keymap_angle_mod_enabled",
      "keymap_keyboard_layout",
      "keymap_keys",
    ],
    (result) => {
      const updates = {};

      if (result.keymap_enabled === undefined) {
        updates.keymap_enabled = true;
      }

      if (result.keymap_angle_mod_enabled === undefined) {
        updates.keymap_angle_mod_enabled = false;
      }

      if (result.keymap_keyboard_layout === undefined) {
        updates.keymap_keyboard_layout = "qwerty";
      }

      if (result.keymap_keys === undefined) {
        const keyMappings = {};
        for (const key of ALL_KEYS) {
          keyMappings[key] = {
            text_color: DEFAULT_TEXT_COLOR,
            bg_color: DEFAULT_BG_COLOR,
          };
        }

        updates.keymap_keys = keyMappings;
      }

      if (Object.keys(updates).length > 0) {
        chrome.storage.sync.set(updates);
      }
    },
  );
});
