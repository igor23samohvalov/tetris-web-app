import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { makeid } from '../frontend/utilityFNs.js';

const isProduction = process.env.NODE_ENV == 'production';
const PORT = process.env.PORT ? process.env.PORT : 3000
const devHost = 'http://localhost:8080';
const isDevelopment = !isProduction;


const app = express();

app.use(cors());
app.use(express.static('../dist'));

if (process.env.npm_lifecycle_script.includes('production')) {
  app.set('view engine', 'pug');
  
  app.get('/', (req, res) => res.render('index'));
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: isDevelopment ? devHost : '',
  }
});

const state = {};

const buildRoomState = (roomId, profile) => ({
  roomId,
  roomOwner: profile,
  players: [],
  messages: [],
  ready: [],
  losers: [],
  winner: undefined,
  gameState: null,
})

io.on('connection', (socket) => {
  console.log(socket.id, ' connected');

  socket.on('newLobby', (profile = 1) => {
    const roomId = makeid(5);
    state[roomId] = buildRoomState(roomId, profile);

    socket.join(roomId)
    socket.number = 1;
    socket.roomId = roomId;
    state[roomId].players.push(profile);
    state[roomId].gameState = 'lobby';

    socket.emit('newLobby', state[roomId]);
  })

  socket.on('joinLobby', ({profile, roomId}) => {
    socket.roomId = roomId;
    handleJoinGame(roomId, socket, profile);
  })
  socket.on('playerReady', ({ready, player}) => {
    const { roomId } = socket;
  
    if (ready) state[roomId].ready.push(player)
    else state[roomId].ready = state[roomId].ready.filter((p) => p !== player)

    io.to(state[roomId].roomId).emit('playerReady', state[roomId].ready);
  })

  socket.on('loadGame', () => {
    const { roomId } = socket;
    state[roomId].gameState = 'game';
  
    io.to(state[roomId].roomId).emit('loadGame', state[roomId].players);
  })

  socket.on('startMatch', () => {
    const { roomId } = socket;

    io.to(state[roomId].roomId).emit('startMatch');
  })

  socket.on('stopMatch', () => {
    const { roomId } = socket;

    io.to(state[roomId].roomId).emit('stopMatch');
  })

  socket.on('newTurn', (data) => {
    const { roomId } = socket;
  
    socket.broadcast.to(state[roomId].roomId).emit('newTurn', data);
  })

  socket.on('newLine', (data) => {
    const { roomId } = socket;
  
    socket.broadcast.to(state[roomId].roomId).emit('newLine', data);
  })

  socket.on('newMessage', (data) => {
    const { roomId } = socket;

    state[roomId].messages.push(data);
    io.to(state[roomId].roomId).emit('newMessage', data);
  })

  socket.on('gameOver?', ({ id, score }) => {
    const { roomId } = socket;
  
    state[roomId].losers.push(id);
  
    if (!state[roomId].winner) state[roomId].winner = { id, score }
    else if (score > state[roomId].winner.score) state[roomId].winner = { id, score }
    else if (score === state[roomId].winner.score) state[roomId].winner = 'draw'

    if (state[roomId].players.length === state[roomId].losers.length) {
      io.to(state[roomId].roomId).emit('gameOver', state[roomId].winner);
    }
  })

  socket.on('leaveGame', (id) => {
    const { roomId } = socket;
  
    if (id === state[roomId].roomOwner) {
      socket.leave(state[roomId].roomId);
      socket.broadcast.to(state[roomId].roomId).emit('lobbyClosed');
      return;
    }

    state[roomId].players = state[roomId].players.filter((p) => p !== id);
    state[roomId].ready = state[roomId].ready.filter((p) => p !== id);
  
    socket.broadcast.to(state[roomId].roomId).emit('leaveGame', state[roomId]);
    socket.leave(state[roomId].roomId);  
  })

  socket.on('disconnect', () => {
    console.log(socket.id, ' disconnected')
  })
})

server.listen(PORT, () => console.log('server is up'));

function handleJoinGame(roomId, socket, profile) {
  const room = io.of("/").adapter.rooms.get(roomId);

  let allUsers;
  if (room) allUsers = room.keys();

  let numClients = 0;
  if (allUsers) numClients = room.size;

  if (numClients === 0) {
    socket.emit('unknownGame');
    return;
  } else if (numClients > 2) {
    socket.emit('tooManyPlayers');
    return;
  } else if (state[roomId].players.includes(profile)) {
    socket.emit('nameIsTaken');
    return;
  } else if (state[roomId].gameState === 'game') {
    socket.emit('gameIsOn');
    return;
  }

  socket.join(roomId);
  socket.number = numClients + 1;

  state[roomId].players.push(profile);

  io.to(state[roomId].roomId).emit('newPlayerJoined', { roomId, players: state[roomId].players, profile });
}