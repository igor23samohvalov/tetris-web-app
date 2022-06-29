import { isGameOver, getPosition, updateOverflow } from './utilityFNs.js';
import menu from './components/menu.js';
import multiplayerMenu from './components/multiplayerMenu.js';

const rowIsEmpty = (row) => !row.includes(1);
const positionIsOutOfField = (position, state) => !state.gameField[position];
const cellIsTaken = (position, state) => state.gameField?.[position]?.classList.contains('taken');
const isPrevRowHasShapeBody = (shape, rowIndex, cellIndex) => shape?.[rowIndex - 1]?.[cellIndex] === 1;

const thisIsLastLine = (position, state) => !state.gameField[position + 10];
const nextLineCellisTaken = (position, state) => state.gameField[position + 10].classList.contains('taken');

const renderCell = (i) => {
  const div = document.createElement('div');
  div.classList.add('cell');
  if (i === 0 || i === 9) div.classList.add('edge');
  return div;
}

const renderEndGame = ({ winner, layout, score }) => {
  const div = document.createElement('div');
  div.classList.add('end-game');

  const span = document.createElement('spam');

  switch (layout) {
    case 'multiplayer':
      if (winner === 'draw') span.textContent = `Nobody won. It's a draw`
      else span.textContent = `Winner is ${winner.id}! Final score: ${winner.score}`;
      break;
    case 'singleplayer':
    default:
      span.textContent = `Your final score: ${score}`;
      break;
  }
  
  const button = document.createElement('button');
  button.classList.add('retry-button', 'btn');
  button.textContent = 'Retry?';
  button.onclick = () => location.reload();

  div.append(span);
  div.append(button);

  document.body.append(div);
}

const startRender = (state, watchedState) => {
  const { shapePosition, currentShape, layout } = state;
  const tempCellsContainer = [];
  if (isGameOver(state.gameField)) {
    switch (state.layout) {
      case 'multiplayer':
        watchedState.render = 'pause';
        state.socket.emit('gameOver?', { id: state.player, score: state.score });
        if (state.gameOwner) {
          document.querySelector('#startButton').disabled = true;
        }
        return;
      case 'singleplayer':
      default:
        watchedState.render = 'finish';
        return;
    } 
  };

  state.currentCells.forEach((cell) => {
    state.gameField[cell].classList.remove('bg-cyan')
  })

  // state.gameField.forEach((cell) => {
  //   cell.classList.remove('bg-cyan');
  // });
  state.currentCells = [];

  currentShape.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const position = getPosition(shapePosition, rowIndex, cellIndex);

      if ((rowIsEmpty(row) && (positionIsOutOfField(position, state) || cellIsTaken(position, state))) && isPrevRowHasShapeBody(currentShape, rowIndex, cellIndex)) { 
        state.render = 'next';
      } else if (cell === 1) {
        state.gameField[position].classList.add('bg-cyan');
        state.currentCells.push(position);
        tempCellsContainer.push(position);

        if (thisIsLastLine(position, state) || nextLineCellisTaken(position, state)) {
          state.render = 'next';
        } 
      }
    });
  });
  // console.log(state.currentEmpties)
  if (layout === 'multiplayer') {
    watchedState.shapeCells = tempCellsContainer;
  }
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
  if (tempTakenContainer.length !== 0 && state.layout === 'multiplayer') {
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
    line.forEach((cell, i) => {
      state.gameField = state.gameField.filter((_, i) => i !== state.gameField.indexOf(cell));
      cell.remove();
      state.fieldContainer.prepend(renderCell(i));
    });

    state.gameField = Array.from(state.fieldContainer.querySelectorAll('.cell'));
    watchedState.score += 1000;

    const newTakenCells = [];
    state.gameField.forEach((cell, i) => {
      if (cell.classList.contains('taken')) newTakenCells.push(i);
    })
    if (state.layout === 'multiplayer') {
      state.socket.emit('newLine', { 
        cells: cellsToDelete,
        id: state.player,
        score: state.score,
      });
      watchedState.takenCells = newTakenCells;
    }
  });

  watchedState.render = 'start';
};

const renderLayout = ({ layout, players, gameOwner }) => {
  const mainContainer = document.querySelector('.main-container');
  const fieldsContainer = document.querySelector('.fields-container');

  switch (layout) {
    case 'multiplayer':
      mainContainer.append(multiplayerMenu(players, gameOwner));
      return;
    case 'singleplayer':
    default:
      fieldsContainer.append(menu('menu-sp'));
      return;
  }
}

const renderMessage = (messages, currentPlayer) => {
  const chatContainer = document.querySelector('.chat-room');
  const [{ message, player }, ...rest] = messages.reverse();

  const div = document.createElement('div');
  if (player === currentPlayer) div.classList.add('ml-auto');

  div.innerHTML = `
    <span class="chat-player">${player}</span>
    <span class="chat-message">: ${message}</span>
  `
  chatContainer.append(div);
  updateOverflow(chatContainer);
}

export { 
  renderEndGame,
  stopRender,
  startRender,
  renderCell,
  renderLayout,
  renderMessage,
};