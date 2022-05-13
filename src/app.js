
import './main.css';
// shapes
const shapeT = [
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 0],
];
const shapeL = [
  [1, 1, 0],
  [0, 1, 0],
  [0, 1, 0],
];
const shapeLReversed = [
  [0, 1, 1],
  [0, 1, 0],
  [0, 1, 0],
];
const shapeS = [
  [1, 1, 0],
  [0, 1, 1],
  [0, 0, 0],
];
const shapeSreversed = [
  [0, 1, 1],
  [1, 1, 0],
  [0, 0, 0],
];
const shapeSquare = [
  [0, 1, 1],
  [0, 1, 1],
  [0, 0, 0],
];
const shapeLine = [
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
];
const shapes = [shapeT,  shapeL,  shapeS,  shapeSquare, shapeLine, shapeLReversed, shapeSreversed];
const badwords = ['oh cmon', 'it dsnt work dude', 'are for real?????', 'i have no words for ur sanity', 'cant you read???'];
function clockTurn(shape) {
  return shape.reduce((acc, row) => {
    row.forEach((cell, cellIndex) => {
      if (!acc[cellIndex]) acc[cellIndex] = []
      acc[cellIndex].unshift(cell)
    })
    return acc;
  }, [])
}

const createCell = () => {
  const div = document.createElement('div');
  div.className = 'cell'
  return div;
}
const createMessage = () => {
  const li = document.createElement('li');
  li.textContent = badwords[getRndInd(5)]
  return li;
}
const createEndGame = (score) => {
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
const scoreTag = document.querySelector('#score');
const field = document.querySelector('.field');
const submitButton = document.querySelector('.chat-submit');
const messageContainer = document.querySelector('.chat-messages');
let gameField = Array.from(document.querySelectorAll('.cell'))

const getPosition = (start, rowIndex, cellIndex) => start + (10 * rowIndex) + cellIndex;
const getRndInd = (length) => (Math.floor(Math.random() * length));

// STATE OF THE GAME
const state = {
  render: 'on',
  getShape: () => shapes[getRndInd(shapes.length)],
  currentShape: shapes[getRndInd(shapes.length)],
  shapePosition: 4,
  fallSpeed: 500,
  score: 0,
}
scoreTag.textContent = `Score: ${state.score}`;
const isGameOver = (field) => {
  const dangerZone = [4, 5, 6, 14, 15, 16, 24, 25, 26, 34, 35, 36];
  const targetCells = field.filter((_, i) => dangerZone.includes(i));
  const takenCells = targetCells.filter((cell) => cell.classList.contains('taken'));
  return takenCells.length > 0;
}
const startRender = () => {
  const { shapePosition, currentShape } = state;
  // end game condition
  if (isGameOver(gameField)) {
    const endgame = createEndGame(state.score)
    document.body.append(endgame);
    return;
  }
  gameField.forEach((cell) => cell.classList.remove('bg-cyan'))
  currentShape.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const position = getPosition(shapePosition, rowIndex, cellIndex);
      // пустая линия и текущая ячейка является (нижней гранью либо занятой клеткой) и клетка линией выше занята
      if ((!row.includes(1) && (!gameField[position]) || gameField?.[position]?.classList.contains('taken')) && currentShape?.[rowIndex - 1]?.[cellIndex] === 1) { 
        state.render = 'next';
      } else if (cell === 1) {
        gameField[position].classList.add('bg-cyan');
        // занятая ячейка и ячейка линией ниже есть (нижняя грань либо занятая клетка)
        if (!gameField[position + 10] || gameField[position + 10].classList.contains('taken')) {
          state.render = 'next';
        }
      } 
      
    })
  })

  switch (state.render) {
    case 'start':
      state.shapePosition += 10;
      setTimeout(() => startRender(currentShape), state.fallSpeed)
      break;
    case 'next':
      stopRender();
      break;
    case 'pause':
      pauseGame()
      break;
  }
}
const colors = ['#51962F', '#EE4266', '#FFD23F', '#51962F', '#E11B1B'];

const stopRender = () => {
  const color = colors[getRndInd(5)];

  
  gameField.forEach((cell) => {
    if (cell.classList.contains('bg-cyan')) {
      cell.classList.add('taken');
      // cell.style.backgroundColor = color;
      // cell.style.border = '1px solid transparent'
    }
  });
  const current = gameField.reduce((acc, cell) => {
    if (acc[acc.length - 1].length === 10) acc.push([]);
    acc[acc.length - 1].push(cell);
    return acc;
  }, [[]])
  const lines = [];
  current.forEach((line) => {
    const lineup = line.filter((cell) => cell.classList.contains('taken'))
    if (lineup.length === 10) lines.push(lineup)
  })
  lines.forEach((line) => {
    line.forEach((cell) => {
      cell.style.backgroundColor = '#FFFF01'
      gameField = gameField.filter((_, i) => i !== gameField.indexOf(cell));
      cell.remove();
      field.prepend(createCell())
    })
    gameField = Array.from(document.querySelectorAll('.cell'))
    state.score += 1000;
    scoreTag.textContent = `Score: ${state.score}`;
  })
  
  initGame(4);
}

// game inteface
const pauseGame = () => {
  console.log('gamePaused')
}

function initGame(defaultPosition = 4, shape = state.getShape()) {
  state.render = 'start';
  state.shapePosition = defaultPosition;
  state.currentShape = shape;
  startRender();
}

// listeners
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
}

document.onkeydown = (e) => {
  if (keyMaps[e.key]) keyMaps[e.key]();
}
document.onkeyup = (e) => {
  if (e.key === 'ArrowDown') keyMaps['downUp']();
}
submitButton.addEventListener('click', () => messageContainer.append(createMessage()));

document.querySelector('#startButton').addEventListener('click', () => initGame(state.shapePosition, state.currentShape))
document.querySelector('#stopButton').addEventListener('click', () => state.render = 'pause')
