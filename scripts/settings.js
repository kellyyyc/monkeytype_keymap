import { KEYBOARD_LAYOUTS } from "../utils/constants.js";
import { createDropdown } from "./dropdown.js";

window.addEventListener("load", () => {
  chrome.storage.sync
    .get(["keymap_angle_mod_enabled", "keymap_keyboard_layout"])
    .then((result) => {
      const isAngleModEnabled = result["keymap_angle_mod_enabled"] ?? false;
      const enableAngleModElem = document.getElementById(
        "enable-angle-mod-btn",
      );
      const disableAngleModElem = document.getElementById(
        "disable-angle-mod-btn",
      );

      if (isAngleModEnabled) {
        enableAngleModElem.classList.add("active-btn");
      } else {
        disableAngleModElem.classList.add("active-btn");
      }

      enableAngleModElem.addEventListener("click", () => {
        disableAngleModElem.classList.remove("active-btn");
        enableAngleModElem.classList.add("active-btn");

        chrome.storage.sync.set({ keymap_angle_mod_enabled: true });
      });

      disableAngleModElem.addEventListener("click", () => {
        enableAngleModElem.classList.remove("active-btn");
        disableAngleModElem.classList.add("active-btn");

        chrome.storage.sync.set({ keymap_angle_mod_enabled: false });
      });

      const saveLayout = (layout) => {
        chrome.storage.sync.set({
          keymap_keyboard_layout: layout,
        });
      };

      const savedLayout = result["keymap_keyboard_layout"] ?? "qwerty";
      const layoutElem = document.getElementById("keyboard-layout-dropdown");
      const selectedLayout = KEYBOARD_LAYOUTS[savedLayout]
        ? savedLayout
        : "qwerty";

      createDropdown({
        dropdownElem: layoutElem,
        options: Object.keys(KEYBOARD_LAYOUTS),
        selectedValue: selectedLayout,
        onChange: saveLayout,
      });
    });
});
