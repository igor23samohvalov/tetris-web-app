import { renderCell } from './render.js';

export default (state, chatView, renderView) => {
  state.socket.on('newMessage', (data) => {
    chatView.push(data);
  });
  state.socket.on('startMatch', () => {
    renderView.value = state.render.value ? 'unpause' : 'start';
  });
  state.socket.on('stopMatch', () => {
    renderView.value = 'pause';
  });
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
  });
  state.socket.on('gameOver', (winner) => {
    state.winner = winner;
    renderView.value = 'pause';
    renderView.value = 'finish';
  });
};