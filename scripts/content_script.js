const { DARK_GRAY, WHITE } = globalThis.KEYMAP_CONSTANTS;

const FRAME_DELAY = 5;
const MAX_RGB_VALUE = 0xff;
const WHITE_TOLERANCE = 0x33;
const KEYMAP_SELECTOR = '[data-ui-element="keymap"]';
const KEY_SELECTOR = '[style*="--keybgcolor"]';

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
  const keymapElem = document.querySelector(KEYMAP_SELECTOR);
  if (!keymapElem) {
    return false;
  }
  const keys = keymapElem.querySelectorAll(KEY_SELECTOR);
  if (keys.length === 0) {
    return false;
  }
  keyboardObserver.observe(keymapElem, {
    subtree: true,
    attributes: true,
    attributeFilter: ["easing", "style", "class"],
  });
  testObserver.observe(keymapElem, {
    subtree: true,
    childList: true,
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
    if (!elem.matches(KEY_SELECTOR)) {
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
  const keymapElem = document.querySelector(KEYMAP_SELECTOR);
  if (!keymapElem) {
    return;
  }

  const keys = keymapElem.querySelectorAll(KEY_SELECTOR);
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

  const textNode = [...key.childNodes].find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
  );
  if (textNode) {
    letter = textNode.textContent.trim().toLowerCase();
  } else if (key.querySelector(":scope > button")) {
    // The spacebar contains a button showing the current layout name.
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

  const keyTextElem = key.querySelector(":scope > button") ?? key;

  if (key.classList.contains("activeKey")) {
    if (isNearWhite(color.bg_color)) {
      key.style.backgroundColor = DARK_GRAY;
      keyTextElem.style.color = WHITE;
    } else {
      key.style.backgroundColor = WHITE;
      keyTextElem.style.color = DARK_GRAY;
    }

    return;
  }

  if (keyTextElem.style.color !== color.text_color) {
    keyTextElem.style.color = color.text_color;
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
