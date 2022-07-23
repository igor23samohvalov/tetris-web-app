import { io } from 'socket.io-client';
import './sass/app.sass';

import { initErrorsProxy, initErrorsState } from './models/errorsState.js';
import { initLobbyState, initLobbyProxy } from './models/lobbyState.js';

import loadInitSocketListeners from './lib/initSocketListeners.js';
import loadErrorSocketListeners from './lib/errorSocketListeners.js';
import loadInitControllers from './controllers/initControllers.js';

const isProduction = process.env.NODE_ENV == 'production';
const isDevelopment = !isProduction;
const devHost = isDevelopment ? 'http://localhost:3000' : '';

const errorsState = initErrorsState();
const errorsProxy = initErrorsProxy(errorsState);
const lobbyState = initLobbyState();
const lobbyProxy = initLobbyProxy(lobbyState);

const socket = io(devHost);

loadInitControllers(socket, errorsProxy);
loadInitSocketListeners(socket, lobbyProxy);
loadErrorSocketListeners(socket, errorsProxy);