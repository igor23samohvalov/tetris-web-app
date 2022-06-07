export default (flex = 'empty') => {
  const div = document.createElement('div');
  div.classList.add('menu-container', flex);
  div.innerHTML = `
    <div class="menu sc m-t">
        <span class="score">Score: 0</span>
    </div>
    <div class="menu m-t">
        <button id="startButton">START</button>
        <button id="stopButton">STOP</button>
    </div>
    <div class="menu m-t">
        <h3>Controls:</h3>
        <span>[←] to move left</span>
        <span>[→] to move left</span>
        <span>[↑] spin it!</span>
        <span>[↓] speed it up!</span>
    </div>
  `;
  return div;
};