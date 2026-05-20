const {
  DEFAULT_LAYOUT,
  ANGLE_MOD_LAYOUT,
  ALL_KEYS,
  KEYBOARD_LAYOUTS,
  BLACK,
  RAINBOW_COLORS,
} = globalThis.KEYMAP_CONSTANTS;

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
let isExtensionEnabled = false;
let keyMappings = {};
let selectedKeyboardLayout = "qwerty";
let isAngleModEnabled = false;

window.addEventListener("load", () => {
  const keyboardElem = document.getElementById("keyboard");
  const textPickerElem = document.getElementById("text-color-picker");
  const textPickerInput = textPickerElem.querySelector("input");
  const bgPickerElem = document.getElementById("bg-color-picker");
  const bgPickerInput = bgPickerElem.querySelector("input");

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
    const selectedTextColor = getSelectedColor("text_color");
    updateTextPicker(textPickerElem, textPickerInput, selectedTextColor);

    const selectedBgColor = getSelectedColor("bg_color");
    updateBgPicker(bgPickerElem, bgPickerInput, selectedBgColor);
  };

  chrome.storage.sync
    .get([
      "keymap_enabled",
      "keymap_keys",
      "keymap_keyboard_layout",
      "keymap_angle_mod_enabled",
    ])
    .then((result) => {
      isExtensionEnabled = result["keymap_enabled"] ?? false;
      keyMappings = result["keymap_keys"] ?? {};
      selectedKeyboardLayout = result["keymap_keyboard_layout"] ?? "qwerty";
      isAngleModEnabled = result["keymap_angle_mod_enabled"] ?? false;

      for (const key of ALL_KEYS) {
        if (!keyMappings[key]) {
          keyMappings[key] = getDefaultKeyMapping();
        }
      }

      renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);

      const toggleOnElem = document.getElementById("enable-extension-btn");
      const toggleOffElem = document.getElementById("disable-extension-btn");
      if (isExtensionEnabled) {
        toggleOnElem.classList.add("active-btn");
        keyboardElem.classList.remove("disabled");
      } else {
        toggleOffElem.classList.add("active-btn");
        keyboardElem.classList.add("disabled");
      }

      toggleOnElem.addEventListener("click", () => {
        isExtensionEnabled = true;
        toggleOffElem.classList.remove("active-btn");
        toggleOnElem.classList.add("active-btn");
        keyboardElem.classList.remove("disabled");

        chrome.storage.sync.set({ keymap_enabled: true });
      });

      toggleOffElem.addEventListener("click", () => {
        isExtensionEnabled = false;
        toggleOnElem.classList.remove("active-btn");
        toggleOffElem.classList.add("active-btn");
        keyboardElem.classList.add("disabled");

        deselectAllKeys();

        chrome.storage.sync.set({ keymap_enabled: false });
      });

      document
        .getElementById("save-options-btn")
        .addEventListener("click", () => {
          chrome.storage.sync.set({ keymap_keys: keyMappings });
        });
    });

  document.getElementById("select-all-btn").addEventListener("click", () => {
    if (!isExtensionEnabled) {
      return;
    }

    selectAllKeys();
  });

  document
    .getElementById("clear-selection-btn")
    .addEventListener("click", () => {
      if (!isExtensionEnabled) {
        return;
      }

      deselectAllKeys();
    });

  updateTextPicker(textPickerElem, textPickerInput);
  textPickerInput.addEventListener("input", () => {
    const selectedColor = textPickerInput.value;
    updateTextPicker(textPickerElem, textPickerInput, selectedColor);

    for (const [key, isSelected] of Object.entries(selected)) {
      if (isSelected) {
        keyMappings[key].text_color = selectedColor;
      }
    }

    renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);
  });

  updateBgPicker(bgPickerElem, bgPickerInput);
  bgPickerInput.addEventListener("input", () => {
    const selectedColor = bgPickerInput.value;
    updateBgPicker(bgPickerElem, bgPickerInput, selectedColor);

    for (const [key, isSelected] of Object.entries(selected)) {
      if (isSelected) {
        keyMappings[key].bg_color = selectedColor;
      }
    }

    renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);
  });

  document.getElementById("reset-options-btn").addEventListener("click", () => {
    if (!isExtensionEnabled) {
      return;
    }

    for (const key of ALL_KEYS) {
      keyMappings[key] = getDefaultKeyMapping();
    }

    renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);
  });

  document.getElementById("rainbow-mode-btn").addEventListener("click", () => {
    if (!isExtensionEnabled) {
      return;
    }

    const keyboardLayout =
      KEYBOARD_LAYOUTS[selectedKeyboardLayout] ?? KEYBOARD_LAYOUTS.qwerty;

    keyboardLayout.forEach((row, rowIdx) => {
      for (const [idx, key] of row.entries()) {
        const color = getRainbowColor(rowIdx, idx);
        keyMappings[key] = { text_color: BLACK, bg_color: color };
      }
    });

    renderKeyboardElem(keyboardElem, keyMappings, handleKeyClick);
  });

  const selectAllKeys = () => {
    for (const key in selected) {
      selected[key] = true;
    }

    for (const elem of document.getElementsByClassName("key")) {
      elem.style.borderColor = colors.mainColor;
    }

    const selectedTextColor = getSelectedColor("text_color");
    updateTextPicker(textPickerElem, textPickerInput, selectedTextColor);
    const selectedBgColor = getSelectedColor("bg_color");
    updateBgPicker(bgPickerElem, bgPickerInput, selectedBgColor);
  };

  const deselectAllKeys = () => {
    for (const key in selected) {
      selected[key] = false;
    }

    for (const elem of document.getElementsByClassName("key")) {
      elem.style.borderColor = colors.backgroundColor;
    }

    updateTextPicker(textPickerElem, textPickerInput);
    updateBgPicker(bgPickerElem, bgPickerInput);
  };
});

const renderKeyboardElem = (keyboardElem, colorsArr, handleKeyClick) => {
  keyboardElem.replaceChildren();
  const keyboardLayout =
    KEYBOARD_LAYOUTS[selectedKeyboardLayout] ?? KEYBOARD_LAYOUTS.qwerty;

  keyboardLayout.forEach((row, rowIdx) => {
    const rowElem = document.createElement("div");
    rowElem.className = "row";
    rowElem.id = "row-" + rowIdx;
    for (const key of row) {
      const keyColor = colorsArr[key] ?? getDefaultKeyMapping();
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

const updateTextPicker = (textPickerElem, textPickerInput, color = null) => {
  const textPickerIcon = textPickerElem.querySelector("svg");

  if (isNoneSelected()) {
    textPickerIcon.style.color = colors.subColor;
    textPickerElem.classList.add("disabled");
    return;
  } else {
    textPickerElem.classList.remove("disabled");
  }

  color = color ?? colors.subColor;

  textPickerIcon.style.color = color;

  if (textPickerInput.value !== color) {
    textPickerInput.value = color;
  }
};

const updateBgPicker = (bgPickerElem, bgPickerInput, color = null) => {
  if (isNoneSelected()) {
    bgPickerElem.style.backgroundColor = colors.subColor;
    bgPickerElem.classList.add("disabled");
    return;
  } else {
    bgPickerElem.classList.remove("disabled");
  }

  color = color ?? colors.subColor;

  bgPickerElem.style.backgroundColor = color;
  if (bgPickerInput.value !== color) {
    bgPickerInput.value = color;
  }
};

const getDefaultKeyMapping = () => {
  return {
    text_color: colors.subColor,
    bg_color: colors.subAltColor,
  };
};

const getRainbowColor = (rowIdx, keyIdx) => {
  const rainbowLayout = isAngleModEnabled ? ANGLE_MOD_LAYOUT : DEFAULT_LAYOUT;
  const finger = rainbowLayout[rowIdx]?.[keyIdx];

  return RAINBOW_COLORS[finger] ?? colors.subAltColor;
};

const isNoneSelected = () => {
  for (const key in selected) {
    if (selected[key]) {
      return false;
    }
  }

  return true;
};

const getSelectedColor = (colorType) => {
  let selectedColor = null;

  for (const key in keyMappings) {
    if (!selected[key]) {
      continue;
    }

    const color = keyMappings[key][colorType];

    if (selectedColor === null) {
      selectedColor = color;
      continue;
    }

    if (selectedColor !== color) {
      return null;
    }
  }

  return selectedColor;
};
