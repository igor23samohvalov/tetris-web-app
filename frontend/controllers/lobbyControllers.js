export default (player, socket) => {
  const readyButton = document.querySelector('#lobby-ready');
  const quitButton = document.querySelector('#lobby-quit');
  const startButton = document.querySelector('#lobby-start');

  readyButton.addEventListener('click', (e) => {
    switch (e.target.textContent) {
      case 'READY':
        socket.emit('playerReady', { ready: true, player })
        readyButton.textContent = 'NOT READY';
        break;
      case 'NOT READY':
        socket.emit('playerReady', { ready: false, player })
        readyButton.textContent = 'READY';
        break;
    }
  });
  quitButton.addEventListener('click', () => {
    socket.emit('leaveGame', player);
    location.reload();
  });
  startButton.addEventListener('click', () => {
    socket.emit('loadGame');
  })
}