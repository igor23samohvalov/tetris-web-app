export default () => {
  const div = document.createElement('div');
  div.classList.add('menu-container', 'multiplayer');
  div.innerHTML = `
    <div class="chat">
      <i class="chat-header">Players:</i>
      <i class="chat-header">Chat:</i>
      <div class="chat-users"></div>
      <div class="chat-room"></div>
      <div class="chat-footer">
          <input type="text" class="chat-input" placeholder="Go ahead">
          <button class="chat-submit">> Send</button>
      </div>
    </div>
    <div class="menu">
        <button id="startButton">START</button>
        <button id="stopButton">STOP</button>
    </div>
    <div class="menu">
        <h3>Controls:</h3>
        <span>[←] to move left</span>
        <span>[→] to move left</span>
        <span>[↑] spin it!</span>
        <span>[↓] speed it up!</span>
    </div>
  `;
  return div;
};