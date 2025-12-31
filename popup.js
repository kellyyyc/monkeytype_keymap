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

const selected = {};
let key_mappings = {};

window.addEventListener("load", () => {
  for (const key of ALL_KEYS) {
    selected[key] = false;
  }

  chrome.storage.sync.get(["monkeytype_keymap_keys"]).then((result) => {
    key_mappings = result["monkeytype_keymap_keys"];
    render_keyboard_elem(key_mappings);

    document.getElementById("save-button").addEventListener("click", () => {
      chrome.storage.sync.set({ monkeytype_keymap_keys: key_mappings });
    });
  });

  document.getElementById("select-button").addEventListener("click", () => {
    for (const key in selected) {
      selected[key] = true;
    }

    for (let elem of document.getElementsByClassName("key")) {
      elem.style.border = "2px solid #e2b714";
    }
  });

  document.getElementById("deselect-button").addEventListener("click", () => {
    for (const key in selected) {
      selected[key] = false;
    }

    for (let elem of document.getElementsByClassName("key")) {
      elem.style.border = "2px solid #2c2e31";
    }
  });

  document.getElementById("text-color-picker").addEventListener("input", () => {
    const selected_color = document.getElementById("text-color-picker").value;

    for (const key in selected) {
      if (selected[key]) {
        key_mappings[key].text_color = selected_color;
      }
    }

    render_keyboard_elem(key_mappings);
  });

  document.getElementById("bg-color-picker").addEventListener("input", () => {
    const selected_color = document.getElementById("bg-color-picker").value;

    for (const key in selected) {
      if (selected[key]) {
        key_mappings[key].bg_color = selected_color;
      }
    }

    render_keyboard_elem(key_mappings);
  });

  document.getElementById("reset-button").addEventListener("click", () => {
    for (const key of ALL_KEYS) {
      key_mappings[key] = { text_color: "#d1d0c5", bg_color: "#2c2e31" };
    }

    render_keyboard_elem(key_mappings);
  });

  document.getElementById("rainbow-button").addEventListener("click", () => {
    KEYBOARD_LAYOUT.forEach((row) => {
      for (const i in row) {
        const key = row[i];

        const color = get_rainbow_color(i);
        key_mappings[key] = { text_color: "#000000", bg_color: color };
      }
    });

    key_mappings["spacebar"] = {
      text_color: "#000000",
      bg_color: get_rainbow_color(-1),
    };

    render_keyboard_elem(key_mappings);
  });
});

const render_keyboard_elem = (colors_arr) => {
  const keyboard_elem = document.getElementById("keyboard-container");
  keyboard_elem.replaceChildren();
  KEYBOARD_LAYOUT.forEach((row, i) => {
    const row_elem = document.createElement("div");
    row_elem.className = "row";
    row_elem.id = "row-" + i;
    for (const key of row) {
      const key_color = colors_arr[key];
      const key_elem = create_key_elem(
        key,
        key_color.text_color,
        key_color.bg_color
      );

      row_elem.appendChild(key_elem);
    }

    keyboard_elem.appendChild(row_elem);
  });

  const spacebar_elem = document.querySelector('[data-key="spacebar"]');
  spacebar_elem.classList.add("spacebar");
};

const create_key_elem = (key, text_color, bg_color) => {
  const key_elem = document.createElement("div");
  key_elem.className = "key";
  key_elem.setAttribute("data-key", key);
  key_elem.style.backgroundColor = bg_color;
  key_elem.style.border = get_border_color(key, bg_color);

  key_elem.addEventListener("click", () => {
    selected[key] = !selected[key];
    key_elem.style.border = get_border_color(key, bg_color);
  });

  const letter_elem = document.createElement("div");
  letter_elem.className = "letter";
  letter_elem.textContent = key;
  letter_elem.style.color = text_color;

  key_elem.appendChild(letter_elem);

  return key_elem;
};

const get_border_color = (key, bg_color) => {
  return selected[key] ? "2px solid #e2b714" : `2px solid ${bg_color}`;
};

const get_rainbow_color = (idx) => {
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
      return "#2c2e31";
  }
};
