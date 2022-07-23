import onChange from 'on-change';
import { renderMessage } from '../lib/render.js';

export default (state) => onChange(state.messages, (_, value) => {
  renderMessage(value, state.player);
});