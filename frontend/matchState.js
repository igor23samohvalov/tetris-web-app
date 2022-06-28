import shapes from './shapes.js';
import { getRndInd } from './utilityFNs.js';


export default (gameMode, field, player = 1, socket = '', players = []) => ({
  render: null,
  getShape: () => shapes[getRndInd(shapes.length)],
  currentShape: shapes[getRndInd(shapes.length)],
  currentCells: [],
  shapePosition: 4,
  fallSpeed: 400,
  score: 0,
  gameField: Array.from(field.querySelectorAll('.cell')),
  socket: socket,
  messages: [],
  layout: gameMode,
  fieldContainer: field,
  player,
  players,
  shapeCells: [],
  takenCells: [],
  winner: null,
})