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

let keyColors = null;

chrome.storage.sync.get(["keymap_enabled", "keymap_keys"]).then((result) => {
  const isEnabled = result["keymap_enabled"];
  keyColors = result["keymap_keys"] ?? {};

  if (isEnabled) {
    const id = setInterval(() => {
      if (startObserver()) {
        clearInterval(id);
      }
    }, 100);
  }
});

const startObserver = () => {
  const keymapElem = document.getElementById("keymap");
  if (!keymapElem) {
    return false;
  }

  const keys = keymapElem.getElementsByClassName("keymapKey");
  if (keys.length === 0) {
    return false;
  }

  keyboardObserver.observe(keymapElem, {
    subtree: true,
    attributes: true,
    attributeFilter: ["easing", "style", "class"],
  });

  const typingTestElem = document.getElementById("typingTest");
  typingTestObserver.observe(typingTestElem, {
    attributes: true,
    attributeFilter: ["class"],
  });

  for (const key of keys) {
    changeKeyColour(key);
  }

  return true;
};

const keyboardObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type !== "attributes") {
      continue;
    }
    const elem = mutation.target;
    if (!elem.classList.contains("keymapKey")) {
      continue;
    }

    changeKeyColour(elem);
  }
});

const typingTestObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type !== "attributes") {
      continue;
    }

    const elem = mutation.target;
    if (!elem.classList.contains("hidden")) {
      const keymapElem = document.getElementById("keymap");
      if (!keymapElem) {
        continue;
      }
      const keys = keymapElem.getElementsByClassName("keymapKey");
      if (keys.length === 0) {
        continue;
      }
      for (const key of keys) {
        changeKeyColour(key);
      }
    }
  }
});

const changeKeyColour = (key) => {
  const dataKey = key.getAttribute("data-key");
  let color = null;
  let letter = null;
  if (dataKey) {
    letter = dataKey.slice(0, 1);
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

  if (key.classList.contains("activeKey")) {
    key.style.backgroundColor = "#ffffff";
    return;
  }

  color = keyColors?.[letter];

  const keyStyleDelay = (numFrames) => {
    if (numFrames <= 0) {
      if (key.style.backgroundColor !== color.bg_color) {
        key.style.backgroundColor = color.bg_color;
      }

      if (key.style.color !== color.text_color) {
        key.style.color = color.text_color;
      }

      return;
    }

    requestAnimationFrame(() => keyStyleDelay(numFrames - 1));
  };

  if (color) {
    keyStyleDelay(FRAME_DELAY);
  }
};
