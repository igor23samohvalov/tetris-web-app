import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { makeid } from '../utilityFNs.js';

const isProduction = process.env.NODE_ENV == 'production';
const devHost = 'http://localhost:8080';
const isDevelopment = !isProduction;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: isDevelopment ? devHost : '',
  }
});

const state = {};

const buildRoomState = (roomId) => ({
  roomId,
  players: [],
  messages: [],
  ready: [],
  losers: [],
  winner: undefined,
})

io.on('connection', (socket) => {
  console.log(socket.id, ' connected');

  socket.on('newLobby', () => {
    const roomId = makeid(5);
    state[roomId] = buildRoomState(roomId);

    socket.join(roomId)
    socket.number = 1;
    socket.roomId = roomId;
    state[roomId].players.push(socket.number);

    socket.emit('newLobby', state[roomId]);
  })

  socket.on('joinLobby', ({msg, roomId}) => {
    console.log(msg, roomId);
    socket.roomId = roomId;
    handleJoinGame(roomId, socket);
  })
  socket.on('playerReady', ({ready, player}) => {
    const { roomId } = socket;
  
    if (ready) state[roomId].ready.push(player)
    else state[roomId].ready = state[roomId].ready.filter((p) => p !== player)

    io.to(state[roomId].roomId).emit('playerReady', state[roomId].ready);
  })

  socket.on('loadGame', () => {
    const { roomId } = socket;
  
    io.to(state[roomId].roomId).emit('loadGame', state[roomId].players);
  })

  socket.on('newTurn', (data) => {
    const { roomId } = socket;
  
    socket.broadcast.to(state[roomId].roomId).emit('newTurn', data);
  })

  socket.on('newLine', (data) => {
    const { roomId } = socket;
  
    socket.broadcast.to(state[roomId].roomId).emit('newLine', data);
  })

  socket.on('newMessage', (message) => {
    const { roomId } = socket;

    state[roomId].messages.push(message);
    io.to(state[roomId].roomId).emit('newMessage', message)
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
    console.log(`player${id} left the game`);

    state[roomId].players = state[roomId].players.filter((p) => p !== id);
    state[roomId].ready = state[roomId].ready.filter((p) => p !== id);
  
    socket.broadcast.to(state[roomId].roomId).emit('leaveGame', state[roomId]);
    socket.leave(state[roomId].roomId);  
  })

  socket.on('disconnect', () => {
    console.log(socket.id, ' disconnected')
  })
})

server.listen(3000, () => console.log('server is up'));

function handleJoinGame(roomId, socket) {
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
  }

  socket.join(roomId);
  socket.number = numClients + 1;

  state[roomId].players.push(socket.number);

  io.to(state[roomId].roomId).emit('newPlayerJoined', { roomId, players: state[roomId].players });
}