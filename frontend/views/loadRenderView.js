import onChange from 'on-change';
import { startRender, renderEndGame } from '../lib/render.js';


export default (state, matchVisualsView) => {
  const startButton = state.gameOwner
    ? document.querySelector('#startButton')
    : document.querySelector('.chat-users');

  const renderView = onChange(state.render, (_, value) => {
    switch (value) {
      case 'start':
        startButton.disabled = true;
        state.currentShape = state.getShape();
        state.shapePosition = 4;
        startRender(state, renderView, matchVisualsView);
        break;
      case 'next':
        break;
      case 'pause':
        startButton.disabled = false;
        break;
      case 'unpause':
        startButton.disabled = true;
        state.render.value = 'start';
        startRender(state, renderView, matchVisualsView);
        break;
      case 'finish':
        renderEndGame(state);
      default:
        break;
    }
  });
  return renderView;
};