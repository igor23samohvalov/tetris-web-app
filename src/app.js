
import { io } from 'socket.io-client';
import onChange from 'on-change';
import './main.css';
import shapes from './shapes.js';
import view from './view.js';
import { getRndInd } from './utilityFNs.js';
import lobby, { getPlayers } from './components/lobby.js';
import createFieldsContainer from './components/fieldsContainer.js';
import createField from './components/field.js';
import loadLobbyControllers from './lobbyControllers.js';

const isProduction = process.env.NODE_ENV == 'production';
const isDevelopment = !isProduction;
const devHost = isDevelopment ? 'http://localhost:3000' : '';

let PLAYER;

const newGame = document.querySelector('#newGame');
const joinGame = document.querySelector('#joinGame');
const roomIdinput = document.querySelector('#roomId');
const container = document.querySelector('.main-container');

const lobbyState = {
  players: [],
  ready: [],
}
const lobbyProxy = onChange(lobbyState, (path, value) => {
  const { players } = lobbyState;
  switch (path) {
    case 'ready':
      document.querySelector('.lobby-players').innerHTML = getPlayers(lobbyState).join('');
      if (value.length === players.length && value.length > 0) {
        document.querySelector('#lobby-start').disabled = false;
      } else {
        document.querySelector('#lobby-start').disabled = true;
      }
      break;
    case 'players':
    default:
      document.querySelector('.lobby-players').innerHTML = getPlayers(lobbyState).join('');
      break;
  }
})

// state buiilder
const buildState = (gameMode, field, player = 1, socket = '') => ({
  render: null,
  getShape: () => shapes[getRndInd(shapes.length)],
  currentShape: shapes[getRndInd(shapes.length)],
  shapePosition: 4,
  fallSpeed: 400,
  score: 0,
  gameField: Array.from(field.querySelectorAll('.cell')),
  socket: socket,
  messages: [],
  layout: gameMode,
  fieldContainer: field,
  player,
  shapeCells: [],
  takenCells: [],
  winner: null,
})

// singleplayer start listener
document.querySelector('#singleplayer').addEventListener('click', () => {
  socket.disconnect();

  const fieldsContainer = createFieldsContainer();
  container.append(fieldsContainer);
  const field = createField(1, 'singleplayer');
  fieldsContainer.append(field);
  
  const state = buildState('singleplayer', field);
  view(state);

  document.querySelector('.init').style.display = 'none';
})

const socket = io(devHost);
socket.on('connect', () => {
  console.log('connected to the socket')
})

// starting multiplayer
newGame.addEventListener('click', () => {
  socket.emit('newLobby', 'multiplayer initialize game request');
})
socket.on('newLobby', ({ roomId, players }) => {
  PLAYER = 1;

  document.querySelector('.init').style.display = 'none';
  document.body.append(lobby(roomId, 'block'));
  lobbyProxy.players = players;
  loadLobbyControllers(PLAYER, socket);
})

// socket error sceneries
socket.on('unknownGame', () => console.log('unknown Room ID'));
socket.on('tooManyPlayers', () => console.log('game room is FULL'));
// 

// another players connection listeners
  // outcome
joinGame.addEventListener('click', () => {
  socket.emit('joinLobby', { 
    msg: 'another player requests to join the room: ',
    roomId: roomIdinput.value,
  });
})
  // income
socket.on('newPlayerJoined', ({ roomId, players }) => {
  document.querySelector('.init').style.display = 'none';

  if (!PLAYER) {
    document.body.append(lobby(roomId, 'none'))
    PLAYER = players.length
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
      const state = buildState('multiplayer', field, PLAYER, socket);
      view(state);
    }
  });
})

socket.on('leaveGame', ({ ready, players }) => {
  lobbyProxy.players = players;
  lobbyProxy.ready = ready;
})