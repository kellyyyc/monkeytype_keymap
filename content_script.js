const FRAME_DELAY = 5;

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
    changeKeyColour(key);
  }

  return true;
};

const keyboardObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const elem = mutation.target;
    if (!elem.classList.contains("keymapKey")) {
      continue;
    }

    changeKeyColour(elem);
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
    changeKeyColour(key);
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
