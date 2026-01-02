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

const KEYBOARD_LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ["spacebar"],
];

const styles = getComputedStyle(document.documentElement);

const cssVars = {
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
    isEnabled = result["keymap_enabled"] ?? false;
    keyMappings = result["keymap_keys"] ?? {};
    renderKeyboardElem(keyMappings);

    document.getElementById("save-button").addEventListener("click", () => {
      chrome.storage.sync.set({ keymap_keys: keyMappings });
    });
  });

  document.getElementById("select-button").addEventListener("click", () => {
    for (const key in selected) {
      selected[key] = true;
    }

    for (let elem of document.getElementsByClassName("key")) {
      elem.style.borderColor = colors.mainColor;
    }
  });

  document.getElementById("deselect-button").addEventListener("click", () => {
    for (const key in selected) {
      selected[key] = false;
    }

    for (let elem of document.getElementsByClassName("key")) {
      elem.style.borderColor = colors.subAltColor;
    }
  });

  const tectColorPickerElem = document.getElementById("text-color-picker");
  tectColorPickerElem.addEventListener("input", () => {
    const selectedColor = tectColorPickerElem.value;

    for (const [key, isSelected] of Object.entries(selected)) {
      if (isSelected) {
        keyMappings[key].text_color = selectedColor;
      }
    }

    renderKeyboardElem(keyMappings);
  });

  const bgColorPickerElem = document.getElementById("bg-color-picker");
  bgColorPickerElem.addEventListener("input", () => {
    const selectedColor = bgColorPickerElem.value;

    for (const [key, isSelected] of Object.entries(selected)) {
      if (isSelected) {
        keyMappings[key].bg_color = selectedColor;
      }
    }

    renderKeyboardElem(keyMappings);
  });

  document.getElementById("reset-button").addEventListener("click", () => {
    for (const key of ALL_KEYS) {
      keyMappings[key] = {
        text_color: colors.subColor,
        bg_color: colors.subAltColor,
      };
    }

    renderKeyboardElem(keyMappings);
  });

  document.getElementById("rainbow-button").addEventListener("click", () => {
    KEYBOARD_LAYOUT.forEach((row) => {
      for (const i in row) {
        const key = row[i];

        const color = getRainbowColor(i);
        keyMappings[key] = { text_color: "#000000", bg_color: color };
      }
    });

    keyMappings["spacebar"] = {
      text_color: "#000000",
      bg_color: getRainbowColor(-1),
    };

    renderKeyboardElem(keyMappings);
  });
});

const renderKeyboardElem = (colorsArr) => {
  const keyboardElem = document.getElementById("keyboard-container");
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
        keyColor.bg_color
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
  keyElem.style.borderColor = selected[key] ? colors.mainColor : bgColor;

  keyElem.addEventListener("click", () => {
    selected[key] = !selected[key];
    keyElem.style.borderColor = selected[key] ? colors.mainColor : bgColor;
  });

  const letterElem = document.createElement("div");
  letterElem.className = "letter";
  letterElem.textContent = key;
  letterElem.style.color = textColor;

  keyElem.appendChild(letterElem);

  return keyElem;
};

const getRainbowColor = (idx) => {
  switch (parseInt(idx)) {
    case -1:
      return "#9b86ef";
    case 0:
      return "#f22d49";
    case 1:
      return "#efb30e";
    case 2:
      return "#6fd476";
    case 3:
    case 4:
      return "#06b6f1";
    case 5:
    case 6:
      return "#3890d7";
    case 7:
      return "#91e0ed";
    case 8:
      return "#ede568";
    case 9:
    case 10:
    case 11:
      return "#eda1e9";

    default:
      return colors.subAltColor;
  }
};
