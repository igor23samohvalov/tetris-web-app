import onChange from 'on-change';

export default (state) => onChange(state.visuals, (path, value) => {
  const scoreTag = document.querySelector(`.score-${state.player}`);

  switch (path) {
    case 'score':
      scoreTag.textContent = `SCORE: ${value}`;
      break;
    case 'shapeCells':
      state.socket.emit('newTurn', {
        className: 'bg-grey',
        id: state.player,
        cells: value,
      });
      break;
    case 'takenCells':
    default:
      state.socket.emit('newTurn', {
        className: 'taken',
        id: state.player,
        cells: value,
      })
      break;
  }
});