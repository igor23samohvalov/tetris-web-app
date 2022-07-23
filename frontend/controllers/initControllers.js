import createFieldsContainer from '../components/fieldsContainer.js';
import createField from '../components/field.js';
import buildMatchState from '../models/matchState.js';
import view from '../views/view.js';

const container = document.querySelector('.main-container');
const roomIdinput = document.querySelector('#roomId');
const newUsernameInput = document.querySelector('#newUsername');
const joinUsernameInput = document.querySelector('#joinUsername');  

export default (socket, errorsProxy) => {
  singleplayer.addEventListener('click', () => {
    socket.disconnect();
  
    const fieldsContainer = createFieldsContainer();
    container.append(fieldsContainer);
    const field = createField(1, 'singleplayer');
    fieldsContainer.append(field);
    
    const matchState = buildMatchState('singleplayer', field);
    view(matchState);
  
    document.querySelector('.init').style.display = 'none';
  });
  
  newGame.addEventListener('click', (e) => {
    e.preventDefault();
  
    if (!newUsernameInput.value) errorsProxy.start_error = 'username is required'
    else {
      errorsProxy.start_error = '';
      socket.emit('newLobby', newUsernameInput.value);
    };
  })
  
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
  });
}