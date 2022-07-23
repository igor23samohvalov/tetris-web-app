import shapes from '../lib/shapes.js';
import { getRndInd } from '../lib/utilityFNs.js';


export default (gameMode, field, player = 1, socket = '', players = [], gameOwner = true) => ({
  render: {
    value: null,
  },
  visuals: {
    score: 0,
    shapeCells: [],
    takenCells: [],
  },
  getShape: () => shapes[getRndInd(shapes.length)],
  currentShape: shapes[getRndInd(shapes.length)],
  currentCells: [],
  shapePosition: 4,
  fallSpeed: 400,
  gameField: Array.from(field.querySelectorAll('.cell')),
  socket: socket,
  messages: [],
  layout: gameMode,
  fieldContainer: field,
  gameOwner,
  player,
  players,
  winner: null,
})