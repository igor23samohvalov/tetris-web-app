import loadMatchControllers from '../controllers/matchControllers.js';
import { renderLayout } from '../lib/render.js';
import loadChatView from './loadChatView.js';
import loadMatchVisualsView from './loadMatchVisualsView.js';
import loadRenderView from './loadRenderView.js';
import loadMatchSocketListeners from '../lib/matchSocketListeners.js';

const view = (state) => {
  renderLayout(state);
  
  const matchVisualsView = loadMatchVisualsView(state);
  const chatView = loadChatView(state);
  const renderView = loadRenderView(state, matchVisualsView);

  if (state.layout === 'multiplayer') {
    loadMatchSocketListeners(state, chatView, renderView);
  };
 
  loadMatchControllers(state, renderView);
};

export default view;