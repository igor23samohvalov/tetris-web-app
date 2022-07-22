import { clockTurn, getEmptyShapeColls, getPosition } from '../lib/utilityFNs.js';

const loadMatchControllers = (state, renderView) => {
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
  };

  const keyMaps = {
    ArrowLeft: () => {
      const emptyColls = getEmptyShapeColls(state.currentShape, 'left');
      const shapeEdge = state.shapePosition + emptyColls
      const shapeEdges = [];
      for (let i = 0; i <= state.currentShape.length + 0; i += 1) {
        shapeEdges.push((shapeEdge - 1 - emptyColls) + (10 * i));
      }

      if (state.gameField[shapeEdge].classList.contains('edge')) return;
      if (shapeEdges.some((edge) => state.gameField?.[edge]?.classList?.contains('taken'))) {
        console.log('wtf?')
        return;
      };
      state.shapePosition -= 1;
    },
    ArrowUp: () => {
      const turnedShapeClone = clockTurn(state.currentShape.slice());
      let canTurn = true;
      turnedShapeClone.forEach((row, rowI) => {
        row.forEach((_, cellI) => {
          const position = getPosition(state.shapePosition, rowI, cellI);
          if (state.gameField[position].classList.contains('taken')) {
            canTurn = false;
          }
        })
      })
      if (canTurn) state.currentShape = clockTurn(state.currentShape)
    },
    ArrowRight: () => {
      const emptyColls = getEmptyShapeColls(state.currentShape, 'right');
      const shapeEdge = state.shapePosition - emptyColls + (state.currentShape[0].length - 1);
      const shapeEdges = [];
      
      for (let i = 0; i <= state.currentShape.length + 0; i += 1) {
        shapeEdges.push((shapeEdge + 1 + emptyColls) + (10 * i));
      }

      if (state.gameField[shapeEdge].classList.contains('edge')) return;
      if (shapeEdges.some((edge) => state.gameField?.[edge]?.classList?.contains('taken'))) {
        console.log('wtf?')
        return;
      };
      state.shapePosition += 1;
    },
    ArrowDown: () => state.fallSpeed = 50,
    downUp: () => state.fallSpeed = 400,
  };

  document.onkeydown = (e) => {
    if (keyMaps[e.key]) keyMaps[e.key]();
  }
  document.onkeyup = (e) => {
    if (e.key === 'ArrowDown') keyMaps['downUp']();
  }

  document?.querySelector('#startButton')?.addEventListener('click', () => {
    if (state.layout === 'multiplayer') {
      state.socket.emit('startMatch');
    } else {
      renderView.value = state.render.value ? 'unpause' : 'start';
    }
  });
  document?.querySelector('#stopButton')?.addEventListener('click', () => {
    if (state.layout === 'multiplayer') {
      state.socket.emit('stopMatch');
    } else {
      renderView.value = 'pause';
    }
  });
}

export default loadMatchControllers;