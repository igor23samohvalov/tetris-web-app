const shapeT = [
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 0],
];
// bugged on right move
const shapeL = [
  [1, 1, 0],
  [0, 1, 0],
  [0, 1, 0],
];

const shapeLReversed = [
  [0, 1, 1],
  [0, 1, 0],
  [0, 1, 0],
];

const shapeS = [
  [1, 1, 0],
  [0, 1, 1],
  [0, 0, 0],
];

const shapeSreversed = [
  [0, 1, 1],
  [1, 1, 0],
  [0, 0, 0],
];

const shapeSquare = [
  [0, 1, 1],
  [0, 1, 1],
  [0, 0, 0],
];

const shapeLine = [
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 0],
  [0, 1, 0],
];

const shapes = [
  shapeT,
  shapeL,
  shapeS,
  shapeSquare,
  shapeLine,
  shapeLReversed,
  shapeSreversed,
];

export default shapes;
