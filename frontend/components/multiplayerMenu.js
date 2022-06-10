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
          <button class="chat-submit" type="submit">> Send</button>
      </form>
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