import lobby from '../components/lobby.js';
import loadLobbyControllers from '../controllers/lobbyControllers.js';
import createFieldsContainer from '../components/fieldsContainer.js';
import createField from '../components/field.js';
import buildMatchState from '../models/matchState.js';
import view from '../views/view.js';

const container = document.querySelector('.main-container');

export default (socket, lobbyProxy) => {
  let PLAYER;
  let GAME_OWNER;

  socket.on('newLobby', ({ roomId, players }) => {
    PLAYER = players[0];
    GAME_OWNER = true;
  
    document.querySelector('.init').style.display = 'none';
  
    document.body.append(lobby(roomId, 'block'));
    lobbyProxy.players = players;
    loadLobbyControllers(PLAYER, socket);
  });

  socket.on('newPlayerJoined', ({ roomId, players, profile }) => {
    document.querySelector('.init').style.display = 'none';
  
    if (!PLAYER) {
      document.body.append(lobby(roomId, 'none'))
      PLAYER = profile;
      GAME_OWNER = false;
      loadLobbyControllers(PLAYER, socket);
    }
  
    lobbyProxy.players = players;
  });

  socket.on('playerReady', (readyPlayers) => {
    lobbyProxy.ready = readyPlayers;
  });
  
  socket.on('loadGame', (players) => {
    document.querySelector('.lobby').style.display = 'none';
    const fieldsContainer = createFieldsContainer();
    container.append(fieldsContainer);
  
    players.forEach((player) => {
      const field = createField(player, 'multiplayer');
      fieldsContainer.append(field);
  
      if (player === PLAYER) {
        const matchState = buildMatchState('multiplayer', field, PLAYER, socket, players, GAME_OWNER);
        view(matchState);
      }
    });
  });

  socket.on('leaveGame', ({ ready, players }) => {
    lobbyProxy.players = players;
    lobbyProxy.ready = ready;
  });
};