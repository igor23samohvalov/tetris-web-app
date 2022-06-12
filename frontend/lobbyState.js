import onChange from 'on-change';
import { getPlayers } from './components/lobby.js';

export const initLobbyState = () => ({
  players: [],
  ready: [],
});

export const initLobbyProxy = (state) => (onChange(state, (path, value) => {
  const { players } = state;
  switch (path) {
    case 'ready':
      document.querySelector('.lobby-players').innerHTML = getPlayers(state).join('');
      if (value.length === players.length && value.length > 0) {
        document.querySelector('#lobby-start').disabled = false;
      } else {
        document.querySelector('#lobby-start').disabled = true;
      }
      break;
    case 'players':
    default:
      document.querySelector('.lobby-players').innerHTML = getPlayers(state).join('');
      break;
  }
}));