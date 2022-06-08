import { clockTurn, getEmptyShapeColls, getTakenCells } from './utilityFNs.js';

const loadControllers = (state, watchedState) => {
  if (state.layout === 'multiplayer') {
    const submitButton = document.querySelector('.chat-submit');
    const chatInput = document.querySelector('.chat-input');

    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      // if (chatInput.value.length === 0) return;
    
      state.socket.emit('newMessage', {
        message: chatInput.value,
        player: state.player,
      });

      chatInput.value = '';
    });
  }
  
  const invalidCells = ['taken', 'edge']

  const keyMaps = {
    ArrowLeft: () => {
      const emptyColls = getEmptyShapeColls(state.currentShape, 'left');
      const shapeEdge = state.shapePosition + emptyColls

      if (state.gameField[shapeEdge].classList.contains('edge')) return;
      if (state.gameField[shapeEdge - 1].classList.contains('taken')) return;
      state.shapePosition -= 1;
    },
    ArrowUp: () => state.currentShape = clockTurn(state.currentShape),
    ArrowRight: () => {
      const emptyColls = getEmptyShapeColls(state.currentShape, 'right');
      const shapeEdge = state.shapePosition + state.currentShape.length - 1 - emptyColls;
      const takenCells = getTakenCells(state.currentShape, shapeEdge, 'right', emptyColls);

      if (state.gameField[shapeEdge].classList.contains('edge')) return;
      if (takenCells.some((cell) => state.gameField[cell].classList.contains('taken'))) return;
      state.shapePosition += 1; 
    },
    ArrowDown: () => state.fallSpeed = 30,
    downUp: () => state.fallSpeed = 400,
  };

  document.onkeydown = (e) => {
    if (keyMaps[e.key]) keyMaps[e.key]();
  }
  document.onkeyup = (e) => {
    if (e.key === 'ArrowDown') keyMaps['downUp']();
  }



  document.querySelector('#startButton').addEventListener('click', () => {
    watchedState.render = state.render ? 'unpause' : 'start'
  });
  document.querySelector('#stopButton').addEventListener('click', () => state.render = 'pause');
}

export default loadControllers;