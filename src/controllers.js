import { renderMessage } from './render.js';
import { clockTurn } from './utilityFNs.js';

const loadControllers = (state, watchedState) => {
  const submitButton = document.querySelector('.chat-submit');
  const messageContainer = document.querySelector('.chat-messages');

  const keyMaps = {
    ArrowLeft: () => {
      const simplePosition = state.shapePosition.toString().slice(-1);
      if (Number(simplePosition) - 1 < -2) return; // < 0
      state.shapePosition -= 1
    },
    ArrowUp: () => state.currentShape = clockTurn(state.currentShape),
    ArrowRight: () => {
      const simplePosition = state.shapePosition.toString().slice(-1);
      if (Number(simplePosition) + 1 > 9) return; // < 7
      state.shapePosition += 1
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