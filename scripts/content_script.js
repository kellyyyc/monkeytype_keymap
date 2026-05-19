const { DARK_GRAY, WHITE } = globalThis.KEYMAP_CONSTANTS;

const FRAME_DELAY = 5;
const MAX_RGB_VALUE = 0xff;
const WHITE_TOLERANCE = 0x33;

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
  if (!typingTestElem) {
    return false;
  }
  testObserver.observe(typingTestElem, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const pageTestElem = document.getElementsByClassName("pageTest")[0];
  if (!pageTestElem) {
    return false;
  }
  testObserver.observe(pageTestElem, {
    attributes: true,
    attributeFilter: ["class"],
  });

  for (const key of keys) {
    changeKeyColor(key, 0);
  }

  return true;
};

const keyboardObserver = new MutationObserver((mutations) => {
  const seen = new Set();

  for (const mutation of mutations) {
    const elem = mutation.target;
    if (!elem.classList.contains("keymapKey")) {
      continue;
    }

    if (seen.has(elem)) {
      continue;
    }
    seen.add(elem);

    changeKeyColor(elem, FRAME_DELAY);
  }
});

const testObserver = new MutationObserver((mutations) => {
  const keymapElem = document.getElementById("keymap");
  if (!keymapElem) {
    return;
  }

  const keys = keymapElem.getElementsByClassName("keymapKey");
  if (keys.length === 0) {
    return;
  }

  for (const key of keys) {
    changeKeyColor(key, 0);
  }
});

const isNearWhite = (rgb_str) => {
  const r = parseInt(rgb_str.slice(1, 3), 16);
  const g = parseInt(rgb_str.slice(3, 5), 16);
  const b = parseInt(rgb_str.slice(5, 7), 16);

  const isLight =
    MAX_RGB_VALUE - r < WHITE_TOLERANCE &&
    MAX_RGB_VALUE - g < WHITE_TOLERANCE &&
    MAX_RGB_VALUE - b < WHITE_TOLERANCE;

  return isLight;
};

const changeKeyColor = (key, delay) => {
  let letter = null;

  const dataKey = key.getAttribute("data-key");
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

  const color = keyColors?.[letter];
  if (!color) {
    return;
  }

  if (key.classList.contains("activeKey")) {
    if (isNearWhite(color.bg_color)) {
      key.style.backgroundColor = DARK_GRAY;
      key.style.color = WHITE;
    } else {
      key.style.backgroundColor = WHITE;
      key.style.color = DARK_GRAY;
    }

    return;
  }

  if (key.style.color !== color.text_color) {
    key.style.color = color.text_color;
  }

  const keyStyleDelay = (numFrames) => {
    if (numFrames <= 0) {
      if (key.style.backgroundColor !== color.bg_color) {
        key.style.backgroundColor = color.bg_color;
      }

      return;
    }

    requestAnimationFrame(() => keyStyleDelay(numFrames - 1));
  };

  keyStyleDelay(delay);
};
