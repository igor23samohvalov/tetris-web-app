import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { makeid } from '../utilityFNs.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080"
  }
});

const state = {
  roomId: null,
  players: [],
  messages: [],
  ready: [],
  losers: [],
}

io.on('connection', (socket) => {
  console.log(socket.id, ' connected');

  socket.on('newLobby', (msg) => {
    // STATE INIT
    state.roomId = null;
    state.players = [];
    state.messages = [];
    state.ready = [];
    state.losers = [];

    // ROOM INIT
    state.roomId = makeid(5);
    socket.join(state.roomId)
    socket.number = 1;
    state.players.push(socket.number);
  
    socket.emit('newLobby', state);

  })

  socket.on('joinLobby', ({msg, roomId}) => {
    console.log(msg, roomId);
    handleJoinGame(roomId, socket);
  })
  socket.on('playerReady', ({ready, player}) => {
    if (ready) state.ready.push(player)
    else state.ready = state.ready.filter((p) => p !== player)

    io.to(state.roomId).emit('playerReady', state.ready);
  })

  socket.on('loadGame', () => {
    io.to(state.roomId).emit('loadGame', state.players);
  })

  socket.on('newTurn', (data) => {
    socket.broadcast.to(state.roomId).emit('newTurn', data);
  })

  socket.on('newLine', (data) => {
    socket.broadcast.to(state.roomId).emit('newLine', data);
  })

  socket.on('newMessage', (message) => {
    state.messages.push(message);
    console.log('message on server', message)
    io.to(state.roomId).emit('newMessage', message)
  })

  socket.on('gameOver?', (id) => {
    state.losers.push(id);
    if (state.players.length - state.losers.length === 1) {
      const [winner] = state.players.filter((p, _, array) => {
        return state.losers.indexOf(array) !== -1;
      })
      io.to(state.roomId).emit('gameOver', winner);
    }
  })

  socket.on('leaveGame', (id) => {
    console.log(`player${id} left the game`);

    state.players = state.players.filter((p) => p !== id);
    state.ready = state.ready.filter((p) => p !== id);
  
    socket.broadcast.emit('leaveGame', state);
    socket.leave(state.roomId);  
  })

  socket.on('disconnect', () => {
    console.log(socket.id, ' disconnected')
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});

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
  state.players.push(socket.number);

  io.to(state.roomId).emit('newPlayerJoined', { roomId, players: state.players });
}