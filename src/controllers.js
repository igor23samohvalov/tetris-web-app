import { renderMessage } from './render.js';
import { clockTurn, getEmptyShapeColls, getTakenCells } from './utilityFNs.js';

const loadControllers = (state, watchedState) => {
  const submitButton = document.querySelector('.chat-submit');
  const messageContainer = document.querySelector('.chat-messages');
  const invalidCells = ['taken', 'edge']

  const keyMaps = {
    ArrowLeft: () => {
      const emptyColls = getEmptyShapeColls(state.currentShape, 'left');
      const shapeEdge = state.shapePosition + emptyColls

      if (state.gameField[shapeEdge].classList.contains('edge')) return;
      if (state.gameField[shapeEdge - 1].classList.contains('taken')) return;
      state.shapePosition -= 1;
    },
    ArrowUp: () => state.currentShape = clockTurn(state.currentShape),
    ArrowRight: () => {
      const emptyColls = getEmptyShapeColls(state.currentShape, 'right');
      const shapeEdge = state.shapePosition + state.currentShape.length - 1 - emptyColls;
      const takenCells = getTakenCells(state.currentShape, shapeEdge, 'right', emptyColls);

      if (state.gameField[shapeEdge].classList.contains('edge')) return;
      if (takenCells.some((cell) => state.gameField[cell].classList.contains('taken'))) return;
      state.shapePosition += 1; 
    },
    ArrowDown: () => state.fallSpeed = 50,
    downUp: () => state.fallSpeed = 500,
  };

  document.onkeydown = (e) => {
    if (keyMaps[e.key]) keyMaps[e.key]();
  }
  document.onkeyup = (e) => {
    if (e.key === 'ArrowDown') keyMaps['downUp']();
  }

  submitButton.addEventListener('click', () => messageContainer.append(renderMessage()));

  document.querySelector('#startButton').addEventListener('click', () => {
    watchedState.render = state.render ? 'unpause' : 'start'
  });
  document.querySelector('#stopButton').addEventListener('click', () => state.render = 'pause');
}

export default loadControllers;