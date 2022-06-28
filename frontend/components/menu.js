export default () => {
  const div = document.createElement('div');
  div.classList.add('menu-container', 'singleplayer');
  div.innerHTML = `
    <div class="menu sc m-t">
        <span class="score-1 score">SCORE: 0</span>
    </div>
    <div class="menu m-t">
        <button id="startButton" class="btn">START</button>
        <button id="stopButton" class="btn">STOP</button>
    </div>
    <div class="menu m-t">
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