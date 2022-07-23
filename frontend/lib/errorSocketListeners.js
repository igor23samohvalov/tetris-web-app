export default (socket, errorsProxy) => {
  socket.on('unknownGame', () => errorsProxy.room_error = 'no matching lobby');
  socket.on('tooManyPlayers', () => errorsProxy.room_error = 'lobby is full');
  socket.on('nameIsTaken', () => errorsProxy.join_error = 'username is taken');
  socket.on('gameIsOn', () => errorsProxy.room_error = 'game in progress, try letter');
  socket.on('lobbyClosed', () => location.reload());
}