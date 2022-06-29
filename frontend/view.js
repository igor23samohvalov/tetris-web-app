import onChange from 'on-change';
import loadControllers from './controllers.js';
import {
  startRender,
  renderEndGame,
  renderLayout,
  renderMessage,
  renderCell,
} from './render.js';

const view = (state) => {
  renderLayout(state);
  const scoreTag = document.querySelector(`.score-${state.player}`);
  const startButton = state.gameOwner
    ? document.querySelector('#startButton')
    : document.querySelector('.chat-users');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'render') {
      switch (value) {
        case 'start':
          startButton.disabled = true;
          state.currentShape = state.getShape();
          state.shapePosition = 4;
          startRender(state, watchedState);
          break;
        case 'next':
          break;
        case 'pause':
          startButton.disabled = false;
          break;
        case 'unpause':
          startButton.disabled = true;
          state.render = 'start';
          startRender(state, watchedState);
          break;
        case 'finish':
          renderEndGame(state);
        default:
          break;
      }
    } else if (path === 'score') {
      scoreTag.textContent = `SCORE: ${value}`;
    } else if (path === 'messages') {
      renderMessage(value, state.player);
    } else if (path === 'shapeCells') {
      state.socket.emit('newTurn', {
        className: 'bg-yellow',
        id: state.player,
        cells: value,
      })
    } else if (path === 'takenCells') {
      state.socket.emit('newTurn', {
        className: 'taken',
        id: state.player,
        cells: value,
      })
    }
  })
  if (state.layout === 'multiplayer') {
    // socket message listener
    state.socket.on('newMessage', (data) => {
      watchedState.messages.push(data);
    });
    // socket match listeners
    state.socket.on('startMatch', () => {
      console.log('startMatch')
      watchedState.render = state.render ? 'unpause' : 'start';
    });
    state.socket.on('stopMatch', () => {
      console.log('stopMatch')
      watchedState.render = 'pause';
    });
    // socket turn listeners
    state.socket.on('newTurn', ({ className, id, cells }) => {
      const playersField = document.querySelector(`#field${id}`);
      const playersCells = Array.from(playersField.querySelectorAll('.cell'));

      switch(className) {
        case 'taken':
          cells.forEach((cell) => playersCells[cell].classList.add(className));
          break;
        case 'bg-yellow':
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
      watchedState.render = 'pause';
      watchedState.render = 'finish';
    })
  }
 
  loadControllers(state, watchedState);
}

export default view;