const LP = 0;
const LR = 1;
const LM = 2;
const LI = 3;
const RI = 4;
const RM = 5;
const RR = 6;
const RP = 7;
const THUMB = 8;

export const DEFAULT_LAYOUT = [
  [LP, LR, LM, LI, LI, RI, RI, RM, RR, RP, RP, RP],
  [LP, LR, LM, LI, LI, RI, RI, RM, RR, RP, RP],
  [LP, LR, LM, LI, LI, RI, RI, RM, RR, RP],
  [THUMB],
];

export const ANGLE_MOD_LAYOUT = [
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

export const ALL_KEYS = QWERTY_LAYOUT.flat();

export const KEYBOARD_LAYOUTS = {
  qwerty: QWERTY_LAYOUT,
  dvorak: DVORAK_LAYOUT,
  colemak: COLEMAK_LAYOUT,
};

// colors definitions
export const BLACK = "#000000";
export const WHITE = "#ffffff";
export const DEFAULT_TEXT_COLOR = "#646669";
export const DEFAULT_BG_COLOR = "#2c2e31";

export const RAINBOW_COLORS = {
  0: "#f22d49",
  1: "#efb30e",
  2: "#6fd476",
  3: "#06b6f1",
  4: "#3890d7",
  5: "#91e0ed",
  6: "#ede568",
  7: "#eda1e9",
  8: "#9b86ef",
};
