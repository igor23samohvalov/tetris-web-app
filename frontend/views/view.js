import loadMatchControllers from '../controllers/matchControllers.js';
import { renderLayout, renderCell } from '../render.js';
import loadChatView from './loadChatView.js';
import loadMatchVisualsView from './loadMatchVisualsView.js';
import loadRenderView from './loadRenderView.js';

const view = (state) => {
  renderLayout(state);
  const scoreTag = document.querySelector(`.score-${state.player}`);
  const startButton = state.gameOwner
    ? document.querySelector('#startButton')
    : document.querySelector('.chat-users');

  const matchVisualsView = loadMatchVisualsView(state, scoreTag);
  const chatView = loadChatView(state);
  const renderView = loadRenderView(state, matchVisualsView, startButton);

  if (state.layout === 'multiplayer') {
    // socket message listener
    state.socket.on('newMessage', (data) => {
      chatView.push(data);
    });
    // socket match listeners
    state.socket.on('startMatch', () => {
      renderView.value = state.render.value ? 'unpause' : 'start';
    });
    state.socket.on('stopMatch', () => {
      renderView.value = 'pause';
    });
    // socket turn listeners
    state.socket.on('newTurn', ({ className, id, cells }) => {
      const playersField = document.querySelector(`#field${id}`);
      const playersCells = Array.from(playersField.querySelectorAll('.cell'));

      switch(className) {
        case 'taken':
          cells.forEach((cell) => playersCells[cell].classList.add('taken-enemies'));
          break;
        case 'bg-grey':
        default:
          playersCells.forEach((cell) => cell.classList.remove(className));
          cells.forEach((cell) => playersCells[cell].classList.add(className));
          break;
      }
    });

    state.socket.on('newLine', ({ cells, id, score }) => {
      const playersField = document.querySelector(`#field${id}`);
      const playersCells = Array.from(playersField.querySelectorAll('.cell'));

      cells.forEach((cell, i) => {
        playersCells[cell].remove();
        playersField.prepend(renderCell(i))
      });
      document.querySelector(`.score-${id}`).textContent = `Score: ${score}`;
    })

    // socket gameOver listener
    state.socket.on('gameOver', (winner) => {
      console.log('this is winners id: ', winner);
      state.winner = winner;
      renderView.value = 'pause';
      renderView.value = 'finish';
    })
  }
 
  loadMatchControllers(state, renderView);
}

export default view;