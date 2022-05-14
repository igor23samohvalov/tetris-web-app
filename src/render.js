import { getRndInd, isGameOver, getPosition } from './utilityFNs.js';
import { badwords } from './temporary.js';

const field = document.querySelector('.field');

const renderCell = () => {
  const div = document.createElement('div');
  div.className = 'cell';
  return div;
}

const renderMessage = () => {
  const li = document.createElement('li');
  li.textContent = badwords[getRndInd(5)];
  return li;
}

const renderEndGame = (score) => {
  const div = document.createElement('div');
  div.classList.add('end-game');

  const span = document.createElement('spam');
  span.textContent = `Your final score: ${score}`;
  
  const button = document.createElement('button');
  button.classList.add('retry-button');
  button.textContent = 'Retry?';
  button.onclick = () => location.reload();

  div.append(span);
  div.append(button);
  return div;
}

const startRender = (state, watchedState) => {
  const { shapePosition, currentShape } = state;

  if (isGameOver(state.gameField)) return watchedState.render = 'finish';

  state.gameField.forEach((cell) => cell.classList.remove('bg-cyan'));
  currentShape.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const position = getPosition(shapePosition, rowIndex, cellIndex);
      // пустая линия и текущая ячейка является (нижней гранью либо занятой клеткой) и клетка линией выше занята
      if ((!row.includes(1) && (!state.gameField[position]) || state.gameField?.[position]?.classList.contains('taken')) && currentShape?.[rowIndex - 1]?.[cellIndex] === 1) { 
        state.render = 'next';
      } else if (cell === 1) {
        state.gameField[position].classList.add('bg-cyan');
        // занятая ячейка и ячейка линией ниже есть (нижняя грань либо занятая клетка)
        if (!state.gameField[position + 10] || state.gameField[position + 10].classList.contains('taken')) {
          state.render = 'next';
        }
      }
    });
  });
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
  state.gameField.forEach((cell) => {
    if (cell.classList.contains('bg-cyan')) {
      cell.classList.add('taken');
    }
  });

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
    line.forEach((cell) => {
      cell.style.backgroundColor = '#FFFF01'
      state.gameField = state.gameField.filter((_, i) => i !== state.gameField.indexOf(cell));
      cell.remove();
      field.prepend(renderCell())
    });
    state.gameField = Array.from(document.querySelectorAll('.cell'));
    watchedState.score += 1000;
  });

  watchedState.render = 'start';
};

export { 
  renderMessage, renderEndGame, stopRender, startRender, renderCell
};