export default (players) => {
  const div = document.createElement('div');
  div.classList.add('menu-container', 'multiplayer');
  const elementPlayers = players.map((p) => `<p># ${p}</p>`);
  div.innerHTML = `
    <div class="chat">
      <i class="chat-header">Players:</i>
      <i class="chat-header">Chat:</i>
      <div class="chat-users">${elementPlayers.join('')}</div>
      <div class="chat-room"></div>
      <form class="chat-footer">
        <input type="text" class="chat-input" placeholder="Go ahead" name="message" minlength="1">
        <button class="chat-submit btn" type="submit">> Send</button>
      </form>
    </div>
    <div class="menu">
      <button id="startButton" class="btn">START</button>
      <button id="stopButton" class="btn">STOP</button>
    </div>
    <div class="menu">
      <h4>CONTROLS:</h4>
      <div class="controls">
        <i class="gg-arrow-left-r"></i>
        <span>MOVE LEFT</span>
      </div>
      <div class="controls">
        <i class="gg-arrow-right-r"></i>
        <span>MOVE RIGHT</span>
      </div>
      <div class="controls">
        <i class="gg-arrow-up-r"></i>
        <span>ROTATE</span>
      </div>
      <div class="controls">
        <i class="gg-arrow-down-r"></i>
        <span>SPEED UP</span>
      </div>
    </div>
  `;

  return div;
};