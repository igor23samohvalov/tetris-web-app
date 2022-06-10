import onChange from 'on-change';

const output = document.querySelector('.invalid');

export const initErrorsState = () => ({
  roomId: '',
  username: '',
});

export const initErrorsProxy = (state) => (onChange(state, (path, value) => {
  switch (path) {
    case 'username':
      output.textContent = value;
      break;
    case 'roomId':
      output.textContent = value;
    default:
      break;
  }
}))


