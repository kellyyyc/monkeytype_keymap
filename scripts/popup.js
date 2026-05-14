import {
  ALL_KEYS,
  KEYBOARD_LAYOUT,
  BLACK,
  RAINBOW_COLORS,
} from "../utils/constants.js";

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
  const keyboardElem = document.getElementById("keyboard");
  const textColorPickerElem = document.getElementById("text-color-picker");
  const textColorPickerIcon =
    textColorPickerElem.parentElement.querySelector("svg");
  const bgColorPickerElem = document.getElementById("bg-color-picker");
  const bgColorPickerParentElem = bgColorPickerElem.parentElement;

  for (const linkElem of document.querySelectorAll("[data-extension-page]")) {
    linkElem.addEventListener("click", (event) => {
      event.preventDefault();
      chrome.tabs.create({
        url: chrome.runtime.getURL(linkElem.dataset.extensionPage),
      });
    });
  }

  for (const key of ALL_KEYS) {
    selected[key] = false;
  }

  const handleKeyClick = (key) => {
    const selectedCount = Object.values(selected).filter(Boolean).length;
    const selectedTextColor =
      selectedCount === 1 ? keyMappings[key].text_color : null;
    const selectedBgColor =
      selectedCount === 1 ? keyMappings[key].bg_color : null;

    updateTextColorPicker(
      textColorPickerElem,
      textColorPickerIcon,
      selectedTextColor,
    );
    updateBgColorPicker(
      bgColorPickerElem,
      bgColorPickerParentElem,
      selectedBgColor,
    );
  };

  chrome.storage.sync.get(["keymap_enabled", "keymap_keys"]).then((result) => {
    keyMappings = result["keymap_keys"] ?? {};
    renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);

    isEnabled = result["keymap_enabled"] ?? false;
    const toggleOnElem = document.getElementById("enable-extension-btn");
    const toggleOffElem = document.getElementById("disable-extension-btn");
    if (isEnabled) {
      toggleOnElem.classList.add("active-btn");
      keyboardElem.classList.remove("disabled");
    } else {
      toggleOffElem.classList.add("active-btn");
      keyboardElem.classList.add("disabled");
    }

    toggleOnElem.addEventListener("click", () => {
      isEnabled = true;
      toggleOffElem.classList.remove("active-btn");
      toggleOnElem.classList.add("active-btn");
      keyboardElem.classList.remove("disabled");

      chrome.storage.sync.set({ keymap_enabled: true });
    });

    toggleOffElem.addEventListener("click", () => {
      isEnabled = false;
      toggleOnElem.classList.remove("active-btn");
      toggleOffElem.classList.add("active-btn");
      keyboardElem.classList.add("disabled");

      deselectAllKeys();
      updateTextColorPicker(textColorPickerElem, textColorPickerIcon);
      updateBgColorPicker(bgColorPickerElem, bgColorPickerParentElem);

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

  updateTextColorPicker(textColorPickerElem, textColorPickerIcon);
  textColorPickerElem.addEventListener("input", () => {
    const selectedColor = textColorPickerElem.value;
    updateTextColorPicker(
      textColorPickerElem,
      textColorPickerIcon,
      selectedColor,
    );

    for (const [key, isSelected] of Object.entries(selected)) {
      if (isSelected) {
        keyMappings[key].text_color = selectedColor;
      }
    }

    renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);
  });

  updateBgColorPicker(bgColorPickerElem, bgColorPickerParentElem);
  bgColorPickerElem.addEventListener("input", () => {
    const selectedColor = bgColorPickerElem.value;
    updateBgColorPicker(
      bgColorPickerElem,
      bgColorPickerParentElem,
      selectedColor,
    );

    for (const [key, isSelected] of Object.entries(selected)) {
      if (isSelected) {
        keyMappings[key].bg_color = selectedColor;
      }
    }

    renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);
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

      renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);
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

    renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);
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

const renderKeyboardElem = (keyboardElem, colorsArr, handleKeyClick) => {
  keyboardElem.replaceChildren();
  KEYBOARD_LAYOUT.forEach((row, row_idx) => {
    const rowElem = document.createElement("div");
    rowElem.className = "row";
    rowElem.id = "row-" + row_idx;
    for (const key of row) {
      const keyColor = colorsArr[key];
      const keyElem = createKeyElem(
        key,
        keyColor.text_color,
        keyColor.bg_color,
        handleKeyClick,
      );

      rowElem.appendChild(keyElem);
    }

    keyboardElem.appendChild(rowElem);
  });

  const spacebarElem = document.querySelector('[data-key="spacebar"]');
  spacebarElem.classList.add("spacebar");
};

const createKeyElem = (key, textColor, bgColor, handleKeyClick) => {
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

    handleKeyClick(key);
  });

  const letterElem = document.createElement("div");
  letterElem.className = "letter";
  letterElem.textContent = key;
  letterElem.style.color = textColor;
  keyElem.appendChild(letterElem);

  return keyElem;
};

const updateTextColorPicker = (
  colorPickerElem,
  colorPickerIcon,
  color = null,
) => {
  color = color ? color : colors.subColor;

  colorPickerIcon.style.color = color;

  if (colorPickerElem.value != color) {
    colorPickerElem.value = color;
  }
};

const updateBgColorPicker = (
  colorPickerElem,
  colorPickerBgElem,
  color = null,
) => {
  color = color ? color : colors.subColor;

  colorPickerBgElem.style.backgroundColor = color;
  if (colorPickerElem.value != color) {
    colorPickerElem.value = color;
  }
};

const getRainbowColor = (idx) => {
  return RAINBOW_COLORS[idx] ?? colors.subAltColor;
};
