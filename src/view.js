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
  renderLayout(state.layout);
  const scoreTag = document.querySelector(`.score-${state.player}`);

  const watchedState = onChange(state, (path, value) => {
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
          renderEndGame(state);
        default:
          break;
      }
    } else if (path === 'score') {
      scoreTag.textContent = `Score: ${value}`;
    } else if (path === 'messages') {
      renderMessage(value);
    } else if (path === 'shapeCells') {
      state.socket.emit('newTurn', {
        className: 'bg-cyan',
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
  // socket message listener
  state.socket.on('newMessage', (msg) => {
    watchedState.messages.push(msg);
  });
  // socket turn listener
  state.socket.on('newTurn', ({ className, id, cells }) => {
    const playersField = document.querySelector(`#field${id}`);
    const playersCells = Array.from(playersField.querySelectorAll('.cell'));

    switch(className) {
      case 'taken':
        cells.forEach((cell) => playersCells[cell].classList.add(className));
        break;
      case 'bg-cyan':
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
  state.socket.on('gameOver', (id) => {
    console.log('this is winners id: ', id);
    state.winner = id;
    watchedState.render = 'pause';
    watchedState.render = 'finish';
  })
  loadControllers(state, watchedState);
}

export default view;