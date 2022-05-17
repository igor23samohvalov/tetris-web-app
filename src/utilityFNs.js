const createCell = (index) => {  
  const classes = (index % 10 === 0 || (index + 1) % 10 === 0)
    ? ['cell', 'edge']
    : ['cell'];
  const div = document.createElement('div');
  div.classList.add(...classes);
  return div;
}

const isGameOver = (field) => {
  const dangerZone = [4, 5, 6, 14, 15, 16, 24, 25, 26, 34, 35, 36];
  const targetCells = field.filter((_, i) => dangerZone.includes(i));
  const takenCells = targetCells.filter((cell) => cell.classList.contains('taken'));
  return takenCells.length > 0;
}

function clockTurn(shape) {
  return shape.reduce((acc, row) => {
    row.forEach((cell, cellIndex) => {
      if (!acc[cellIndex]) acc[cellIndex] = []
      acc[cellIndex].unshift(cell)
    })
    return acc;
  }, [])
}

const getPosition = (start, rowIndex, cellIndex) => start + (10 * rowIndex) + cellIndex;
const getRndInd = (length) => (Math.floor(Math.random() * length));

const getEmptyShapeColls = (shape, side = 'left') => {
  let newShape = shape;
  if (side === 'right') newShape = shape.map((line) => line.slice().reverse())
  const turnedShape = clockTurn(newShape);
  for (let i = 0; 0 < turnedShape.length; i += 1) {
    if (turnedShape[i].includes(1)) return i;
  }
}

const colMapping = [-1, 0, 1]
const getTakenCells = (shape, shapePos, side, emptyColls) => {
  return shape.reduce((acc, line, i) => {
    if (line.includes(1)) {
      const takenInd = colMapping[line.lastIndexOf(1)]
      acc.push(shapePos + takenInd + emptyColls + 10 * i)
    }

    return acc;
  }, [])
}

export {
  isGameOver,
  getPosition,
  getRndInd,
  clockTurn,
  getEmptyShapeColls,
  getTakenCells,
  createCell
};