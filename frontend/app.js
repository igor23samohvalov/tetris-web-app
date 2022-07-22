
import { io } from 'socket.io-client';
import './sass/app.sass';
import view from './views/view.js';
import lobby from './components/lobby.js';
import createFieldsContainer from './components/fieldsContainer.js';
import createField from './components/field.js';
import loadLobbyControllers from './controllers/lobbyControllers.js';
import { initErrorsProxy, initErrorsState } from './models/errorsState.js';
import { initLobbyState, initLobbyProxy } from './models/lobbyState.js';
import buildMatchState from './models/matchState.js';

const isProduction = process.env.NODE_ENV == 'production';
const isDevelopment = !isProduction;
const devHost = isDevelopment ? 'http://localhost:3000' : '';

let PLAYER;
let GAME_OWNER;

const container = document.querySelector('.main-container');
// buttons
const newGame = document.querySelector('#newGame');
const joinGame = document.querySelector('#joinGame');
// inputs
const roomIdinput = document.querySelector('#roomId');
const newUsernameInput = document.querySelector('#newUsername');
const joinUsernameInput = document.querySelector('#joinUsername');

// states
const errorsState = initErrorsState();
const errorsProxy = initErrorsProxy(errorsState);

const lobbyState = initLobbyState()
const lobbyProxy = initLobbyProxy(lobbyState);

// singleplayer start listener
document.querySelector('#singleplayer').addEventListener('click', () => {
  socket.disconnect();

  const fieldsContainer = createFieldsContainer();
  container.append(fieldsContainer);
  const field = createField(1, 'singleplayer');
  fieldsContainer.append(field);
  
  const matchState = buildMatchState('singleplayer', field);
  view(matchState);

  document.querySelector('.init').style.display = 'none';
})

const socket = io(devHost);
socket.on('connect', () => {
  console.log('connected to the socket')
})

// multiplayer start room listener
newGame.addEventListener('click', (e) => {
  e.preventDefault();

  if (!newUsernameInput.value) errorsProxy.start_error = 'username is required'
  else {
    errorsProxy.start_error = '';
    socket.emit('newLobby', newUsernameInput.value);
  };
})
socket.on('newLobby', ({ roomId, players }) => {
  PLAYER = players[0];
  GAME_OWNER = true;

  document.querySelector('.init').style.display = 'none';

  document.body.append(lobby(roomId, 'block'));
  lobbyProxy.players = players;
  loadLobbyControllers(PLAYER, socket);
})

// multiplayer join room listener
joinGame.addEventListener('click', (e) => {
  e.preventDefault();

  if (!joinUsernameInput.value) errorsProxy.join_error = 'username is required'
  else {
    errorsProxy.join_error = '';
    errorsProxy.room_error = '';

    socket.emit('joinLobby', {
      roomId: roomIdinput.value,
      profile: joinUsernameInput.value,
    });
  }
})
socket.on('newPlayerJoined', ({ roomId, players, profile }) => {
  document.querySelector('.init').style.display = 'none';

  if (!PLAYER) {
    document.body.append(lobby(roomId, 'none'))
    PLAYER = profile;
    GAME_OWNER = false;
    loadLobbyControllers(PLAYER, socket);
  }

  lobbyProxy.players = players;
})

socket.on('playerReady', (readyPlayers) => {
  lobbyProxy.ready = readyPlayers;
})

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
})

// socket error sceneries
socket.on('unknownGame', () => errorsProxy.room_error = 'no matching lobby');
socket.on('tooManyPlayers', () => errorsProxy.room_error = 'lobby is full');
socket.on('nameIsTaken', () => errorsProxy.join_error = 'username is taken');
socket.on('gameIsOn', () => errorsProxy.room_error = 'game in progress, try letter');
socket.on('lobbyClosed', () => location.reload());
// 

socket.on('leaveGame', ({ ready, players }) => {
  lobbyProxy.players = players;
  lobbyProxy.ready = ready;
})
