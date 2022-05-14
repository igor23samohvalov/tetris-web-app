import onChange from 'on-change';
import loadControllers from './controllers.js';
import { startRender, renderEndGame } from './render.js';

const view = (state) => {
  const scoreTag = document.querySelector('#score');

  const watchedState = onChange(state, (path, value) => {
    console.log('watched state path: ', path, 'value: ', value)
    if (path === 'render') {
      switch (value) {
        case 'start':
          state.currentShape = state.getShape();
          state.shapePosition = 4;
          startRender(state, watchedState);
          break;
        case 'next':
          break;
        case 'pause':
          break;
        case 'unpause':
          state.render = 'start';
          startRender(state, watchedState);
          break;
        case 'finish':
          const finishModal = renderEndGame(state.score)
          document.body.append(finishModal);
        default:
          break;
      }
    } else if (path === 'score') {
      scoreTag.textContent = `Score: ${value}`;
    }
  })
  loadControllers(state, watchedState);
}

export default view;