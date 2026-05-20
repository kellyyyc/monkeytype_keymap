(() => {
  const LP = 0;
  const LR = 1;
  const LM = 2;
  const LI = 3;
  const RI = 4;
  const RM = 5;
  const RR = 6;
  const RP = 7;
  const THUMB = 8;

  const DEFAULT_LAYOUT = [
    [LP, LR, LM, LI, LI, RI, RI, RM, RR, RP, RP, RP],
    [LP, LR, LM, LI, LI, RI, RI, RM, RR, RP, RP],
    [LP, LR, LM, LI, LI, RI, RI, RM, RR, RP],
    [THUMB],
  ];

  const ANGLE_MOD_LAYOUT = [
    [LP, LR, LM, LI, LI, RI, RI, RM, RR, RP, RP, RP],
    [LP, LR, LM, LI, LI, RI, RI, RM, RR, RP, RP],
    [LR, LM, LI, LI, RI, RI, RI, RM, RR, RP],
    [THUMB],
  ];

  const QWERTY_LAYOUT = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
    ["spacebar"],
  ];

  const DVORAK_LAYOUT = [
    ["'", ",", ".", "p", "y", "f", "g", "c", "r", "l", "/", "="],
    ["a", "o", "e", "u", "i", "d", "h", "t", "n", "s", "-"],
    [";", "q", "j", "k", "x", "b", "m", "w", "v", "z"],
    ["spacebar"],
  ];

  const COLEMAK_LAYOUT = [
    ["q", "w", "f", "p", "g", "j", "l", "u", "y", ";", "[", "]"],
    ["a", "r", "s", "t", "d", "h", "n", "e", "i", "o", "'"],
    ["z", "x", "c", "v", "b", "k", "m", ",", ".", "/"],
    ["spacebar"],
  ];

  const KEYBOARD_LAYOUTS = Object.freeze({
    qwerty: QWERTY_LAYOUT,
    dvorak: DVORAK_LAYOUT,
    colemak: COLEMAK_LAYOUT,
  });

  const ALL_KEYS = Object.freeze([
    ...new Set(Object.values(KEYBOARD_LAYOUTS).flat(2)),
  ]);

  // colors definitions
  const BLACK = "#000000";
  const DARK_GRAY = "#111111";
  const WHITE = "#ffffff";
  const DEFAULT_TEXT_COLOR = "#646669";
  const DEFAULT_BG_COLOR = "#2c2e31";

  const RAINBOW_COLORS = Object.freeze({
    0: "#f22d49",
    1: "#efb30e",
    2: "#6fd476",
    3: "#06b6f1",
    4: "#3890d7",
    5: "#91e0ed",
    6: "#ede568",
    7: "#eda1e9",
    8: "#9b86ef",
  });

  Object.defineProperty(globalThis, "KEYMAP_CONSTANTS", {
    value: Object.freeze({
      DEFAULT_LAYOUT,
      ANGLE_MOD_LAYOUT,
      KEYBOARD_LAYOUTS,
      ALL_KEYS,
      BLACK,
      WHITE,
      DEFAULT_TEXT_COLOR,
      DEFAULT_BG_COLOR,
      RAINBOW_COLORS,
    }),
    writable: false,
    configurable: false,
  });
})();
