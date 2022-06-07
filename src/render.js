import { isGameOver, getPosition } from './utilityFNs.js';
import menu from './components/menu.js';
import multiplayerMenu from './components/multiplayerMenu.js';

// const field = document.querySelector('.field');

const renderCell = (i) => {
  const div = document.createElement('div');
  div.classList.add('cell');
  if (i === 0 || i === 9) div.classList.add('edge');
  return div;
}

const renderEndGame = ({ winner, layout }) => {
  const div = document.createElement('div');
  div.classList.add('end-game');

  const span = document.createElement('spam');

  switch (layout) {
    case 'multiplayer':
      const score = document.querySelector(`.score-${winner}`).textContent;
      span.textContent = `Winner is Player ${winner}. ${score}`;
      break;
    case 'singleplayer':
    default:
      span.textContent = `Your final score: ${state.score}`;
      break;
  }
  
  const button = document.createElement('button');
  button.classList.add('retry-button');
  button.textContent = 'Retry?';
  button.onclick = () => location.reload();

  div.append(span);
  div.append(button);

  document.body.append(div);
}

const startRender = (state, watchedState) => {
  const { shapePosition, currentShape } = state;
  const tempCellsContainer = [];
  if (isGameOver(state.gameField)) {
    switch (state.layout) {
      case 'multiplayer':
        watchedState.render = 'pause';
        state.socket.emit('gameOver?', state.player);
        document.querySelector('#startButton').disabled = true;
        return;
      case 'singleplayer':
      default:
        watchedState.render = 'finish';
        return;
    } 
  };

  state.gameField.forEach((cell) => cell.classList.remove('bg-cyan'));

  currentShape.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const position = getPosition(shapePosition, rowIndex, cellIndex);
      // пустая линия и текущая ячейка является (нижней гранью либо занятой клеткой) и клетка линией выше занята
      if ((!row.includes(1) && (!state.gameField[position]) || state.gameField?.[position]?.classList.contains('taken')) && currentShape?.[rowIndex - 1]?.[cellIndex] === 1) { 
        state.render = 'next';
      } else if (cell === 1) {
        state.gameField[position].classList.add('bg-cyan');
        tempCellsContainer.push(position);
        // занятая ячейка и ячейка линией ниже есть (нижняя грань либо занятая клетка)
        if (!state.gameField[position + 10] || state.gameField[position + 10].classList.contains('taken')) {
          state.render = 'next';
        }
      }
    });
  });
  watchedState.shapeCells = tempCellsContainer;
  // переделать через watched state
  switch (state.render) {
    case 'start':
      state.shapePosition += 10;
      setTimeout(() => startRender(state, watchedState), state.fallSpeed)
      break;
    case 'next':
      stopRender(state, watchedState);
      break;
    case 'pause':
      break;
  }
};


const stopRender = (state, watchedState) => {
  const tempTakenContainer = [];

  state.gameField.forEach((cell, i) => {
    if (cell.classList.contains('bg-cyan')) {
      cell.classList.add('taken');
      tempTakenContainer.push(i);
    }
  });
  if (tempTakenContainer.length !== 0) {
    watchedState.takenCells.push(...tempTakenContainer);
  }

  const current = state.gameField.reduce((acc, cell) => {
    if (acc[acc.length - 1].length === 10) acc.push([]);
    acc[acc.length - 1].push(cell);
    return acc;
  }, [[]]);

  const lines = [];

  current.forEach((line) => {
    const lineup = line.filter((cell) => cell.classList.contains('taken'))
    if (lineup.length === 10) lines.push(lineup)
  });
  lines.forEach((line) => {
    const cellsToDelete = [];
    line.forEach((cell) => cellsToDelete.push(state.gameField.indexOf(cell)));
    line.forEach((cell) => {
      state.gameField = state.gameField.filter((_, i) => i !== state.gameField.indexOf(cell));
      cell.remove();
      state.fieldContainer.prepend(renderCell());
    });

    state.gameField = Array.from(state.fieldContainer.querySelectorAll('.cell'));
    watchedState.score += 1000;

    const newTakenCells = [];
    state.gameField.forEach((cell, i) => {
      if (cell.classList.contains('taken')) newTakenCells.push(i);
    })

    state.socket.emit('newLine', { 
      cells: cellsToDelete,
      id: state.player,
      score: state.score,
    });
    watchedState.takenCells = newTakenCells;
  });

  watchedState.render = 'start';
};

const renderLayout = (mode) => {
  const mainContainer = document.querySelector('.main-container');
  switch (mode) {
    case 'multiplayer':
      mainContainer.append(multiplayerMenu());
      return;
    case 'singleplayer':
    default:
      mainContainer.append(menu());
      return;
  }
}

const renderMessage = (value) => {
  const p = document.createElement('p');
  p.classList.add('chat-message');
  p.textContent = value[value.length - 1];

  document.querySelector('.chat-room').append(p);
}

export { 
  renderEndGame,
  stopRender,
  startRender,
  renderCell,
  renderLayout,
  renderMessage,
};