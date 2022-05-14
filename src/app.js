
import './main.css';
import shapes from './shapes.js';
import view from './view.js';
import { getRndInd } from './utilityFNs.js';

let num = 5;
num += 1;
console.log(num);
// STATE OF THE GAME
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