import onChange from 'on-change';

const errorInputBorder = '3px solid yellow';
const defaultInputBorder = '3px solid #333';

const errorMapping = (path, value) => {
  document.querySelector(`.${path}`).textContent = value
}

const borderMapping = {
  room_error: '#roomId',
  start_error: '#newUsername',
  join_error: '#joinUsername',
}

export const initErrorsState = () => ({
  room_error: '',
  start_error: '',
  join_error: '',
});

export const initErrorsProxy = (state) => (onChange(state, (path, value) => {
  if (value === '') document.querySelector(borderMapping[path]).style.border = defaultInputBorder
  else document.querySelector(borderMapping[path]).style.border = errorInputBorder

  errorMapping(path, value);
}))


