import {
  ALL_KEYS,
  KEYBOARD_LAYOUT,
  BLACK,
  RAINBOW_COLORS,
} from "./utils/constants.js";

const styles = getComputedStyle(document.documentElement);

const cssVars = {
  backgroundColor: "--background-color",
  mainColor: "--main-color",
  subAltColor: "--sub-alt-color",
  subColor: "--sub-color",
};

const colors = {};
for (const [key, cssVar] of Object.entries(cssVars)) {
  colors[key] = styles.getPropertyValue(cssVar).trim();
}

const selected = {};
let keyMappings = {};
let isEnabled = false;

window.addEventListener("load", () => {
  for (const key of ALL_KEYS) {
    selected[key] = false;
  }

  chrome.storage.sync.get(["keymap_enabled", "keymap_keys"]).then((result) => {
    keyMappings = result["keymap_keys"] ?? {};
    renderKeyboardElem(keyMappings);

    isEnabled = result["keymap_enabled"] ?? false;
    const keyboardContainerElem = document.getElementById("keyboard");
    const toggleOnElem = document.getElementById("enable-extension-btn");
    const toggleOffElem = document.getElementById("disable-extension-btn");
    if (isEnabled) {
      toggleOnElem.classList.add("active");
      keyboardContainerElem.classList.remove("disabled");
    } else {
      toggleOffElem.classList.add("active");
      keyboardContainerElem.classList.add("disabled");
    }

    toggleOnElem.addEventListener("click", () => {
      isEnabled = true;
      toggleOffElem.classList.remove("active");
      toggleOnElem.classList.add("active");
      keyboardContainerElem.classList.remove("disabled");

      chrome.storage.sync.set({ keymap_enabled: true });
    });

    toggleOffElem.addEventListener("click", () => {
      isEnabled = false;
      toggleOnElem.classList.remove("active");
      toggleOffElem.classList.add("active");
      keyboardContainerElem.classList.add("disabled");

      deselectAllKeys();

      chrome.storage.sync.set({ keymap_enabled: false });
    });

    document
      .getElementById("save-settings-btn")
      .addEventListener("click", () => {
        chrome.storage.sync.set({ keymap_keys: keyMappings });
      });
  });

  document.getElementById("select-all-btn").addEventListener("click", () => {
    if (!isEnabled) {
      return;
    }

    selectAllKeys();
  });

  document
    .getElementById("clear-selection-btn")
    .addEventListener("click", () => {
      if (!isEnabled) {
        return;
      }

      deselectAllKeys();
    });

  const textColorPickerElem = document.getElementById("text-color-picker");
  textColorPickerElem.value = colors.subColor;

  const textColorPickerParent = textColorPickerElem.parentElement;
  const textColorPickerIcon = textColorPickerParent.querySelector("svg");
  textColorPickerIcon.style.color = colors.subColor;

  textColorPickerElem.addEventListener("input", () => {
    const selectedColor = textColorPickerElem.value;

    textColorPickerIcon.style.color = selectedColor;

    for (const [key, isSelected] of Object.entries(selected)) {
      if (isSelected) {
        keyMappings[key].text_color = selectedColor;
      }
    }

    renderKeyboardElem(keyMappings);
  });

  const bgColorPickerElem = document.getElementById("bg-color-picker");
  bgColorPickerElem.value = colors.subColor;

  const bgColorPickerParent = bgColorPickerElem.parentElement;
  bgColorPickerParent.style.backgroundColor = colors.subColor;

  bgColorPickerElem.addEventListener("input", () => {
    const selectedColor = bgColorPickerElem.value;

    bgColorPickerParent.style.backgroundColor = selectedColor;

    for (const [key, isSelected] of Object.entries(selected)) {
      if (isSelected) {
        keyMappings[key].bg_color = selectedColor;
      }
    }

    renderKeyboardElem(keyMappings);
  });

  document
    .getElementById("reset-settings-btn")
    .addEventListener("click", () => {
      if (!isEnabled) {
        return;
      }

      for (const key of ALL_KEYS) {
        keyMappings[key] = {
          text_color: colors.subColor,
          bg_color: colors.subAltColor,
        };
      }

      renderKeyboardElem(keyMappings);
    });

  document.getElementById("rainbow-mode-btn").addEventListener("click", () => {
    if (!isEnabled) {
      return;
    }

    KEYBOARD_LAYOUT.forEach((row) => {
      for (const [i, key] of row.entries()) {
        const color = getRainbowColor(i);
        keyMappings[key] = { text_color: BLACK, bg_color: color };
      }
    });
    keyMappings["spacebar"] = {
      text_color: BLACK,
      bg_color: getRainbowColor(-1),
    };

    renderKeyboardElem(keyMappings);
  });
});

const selectAllKeys = () => {
  for (const key in selected) {
    selected[key] = true;
  }

  for (let elem of document.getElementsByClassName("key")) {
    elem.style.borderColor = colors.mainColor;
  }
};

const deselectAllKeys = () => {
  for (const key in selected) {
    selected[key] = false;
  }

  for (let elem of document.getElementsByClassName("key")) {
    elem.style.borderColor = colors.backgroundColor;
  }
};

const renderKeyboardElem = (colorsArr) => {
  const keyboardElem = document.getElementById("keyboard");
  keyboardElem.replaceChildren();
  KEYBOARD_LAYOUT.forEach((row, i) => {
    const rowElem = document.createElement("div");
    rowElem.className = "row";
    rowElem.id = "row-" + i;
    for (const key of row) {
      const keyColor = colorsArr[key];
      const keyElem = createKeyElem(
        key,
        keyColor.text_color,
        keyColor.bg_color,
      );

      rowElem.appendChild(keyElem);
    }

    keyboardElem.appendChild(rowElem);
  });

  const spacebarElem = document.querySelector('[data-key="spacebar"]');
  spacebarElem.classList.add("spacebar");
};

const createKeyElem = (key, textColor, bgColor) => {
  const keyElem = document.createElement("div");
  keyElem.className = "key";
  keyElem.setAttribute("data-key", key);
  keyElem.style.backgroundColor = bgColor;
  keyElem.style.borderColor = selected[key]
    ? colors.mainColor
    : colors.backgroundColor;

  keyElem.addEventListener("click", () => {
    selected[key] = !selected[key];
    keyElem.style.borderColor = selected[key]
      ? colors.mainColor
      : colors.backgroundColor;
  });

  const letterElem = document.createElement("div");
  letterElem.className = "letter";
  letterElem.textContent = key;
  letterElem.style.color = textColor;

  keyElem.appendChild(letterElem);

  return keyElem;
};

const getRainbowColor = (idx) => {
  return RAINBOW_COLORS[idx] ?? colors.subAltColor;
};
