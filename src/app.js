
import './main.css';
import shapes from './shapes.js';
import view from './view.js';
import { getRndInd, createCell } from './utilityFNs.js';

// STATE OF THE GAME

for (let i = 0; i < 200; i += 1) {
  const cell = createCell(i);
  document.querySelector('.field').append(cell);
}

const state = {
  render: null,
  getShape: () => shapes[getRndInd(shapes.length)],
  currentShape: shapes[getRndInd(shapes.length)],
  shapePosition: 4,
  fallSpeed: 500,
  score: 0,
  gameField: Array.from(document.querySelectorAll('.cell')),
}


view(state);