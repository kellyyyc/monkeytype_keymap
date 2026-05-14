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

      const keyboardLayout = result["keymap_keyboard_layout"] ?? "qwerty";
    });
});
