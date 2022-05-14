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

export {
  isGameOver, getPosition, getRndInd, clockTurn
};