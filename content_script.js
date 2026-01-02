const FRAME_DELAY = 5;
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

let key_colors = null;

chrome.storage.sync.get(["keymap_enabled", "keymap_keys"]).then((result) => {
  is_enabled = result["keymap_enabled"];
  key_colors = result["keymap_keys"] ?? {};

  if (is_enabled) {
    const id = setInterval(() => {
      if (start_observer(key_colors)) {
        clearInterval(id);
      }
    }, 100);
  }
});

const start_observer = () => {
  const keymap_elem = document.getElementById("keymap");
  if (!keymap_elem) {
    return false;
  }

  const keys = keymap_elem.getElementsByClassName("keymapKey");
  if (keys.length === 0) {
    return false;
  }

  observer.observe(keymap_elem, {
    subtree: true,
    attributes: true,
    attributeFilter: ["easing", "style"],
  });

  for (const key of keys) {
    change_key_colour(key);
  }

  return true;
};

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type !== "attributes") {
      continue;
    }
    const elem = mutation.target;
    if (!elem.classList.contains("keymapKey")) {
      continue;
    }

    change_key_colour(elem);
  }
});

const change_key_colour = (key) => {
  const data_key = key.getAttribute("data-key");
  let color = null;
  let letter = null;
  if (data_key) {
    letter = data_key.slice(0, 1);
  } else if (
    key.classList.contains("keySpace") &&
    key.classList.contains("left")
  ) {
    letter = "spacebar";
  } else {
    return;
  }

  if (!letter) {
    return;
  }

  color = key_colors?.[letter];

  const key_style_delay = (num_frames) => {
    if (num_frames <= 0) {
      if (key.style.backgroundColor !== color.bg_color) {
        key.style.backgroundColor = color.bg_color;
      }

      if (key.style.color !== color.text_color) {
        key.style.color = color.text_color;
      }

      return;
    }

    requestAnimationFrame(() => key_style_delay(num_frames - 1));
  };

  if (color) {
    key_style_delay(FRAME_DELAY);
  }
};
