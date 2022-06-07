export const getPlayers = ({players, ready}) => {
  return players.reduce((acc, current) => {
    let isReady = ready.includes(current) ? '✓' : 'X';
    acc.push(`<div><span>Player ${current}</span><span>${isReady}</span></div>`);
    return acc;
  }, []);
}

export default (roomId, show) => {
  const div = document.createElement('div');
  div.classList.add('modal', 'lobby');
  
  div.innerHTML = `
    <div>
      <h3>LOBBY: <i>${roomId}</i></h3>
      <div>
          <h3>Connected players:</h3>
          <div class="lobby-players"></div>
      </div>
    </div>
    <div class="lobby-btns">
      <button class="btn" id="lobby-quit">QUIT</button>
      <button class="btn" id="lobby-ready">READY</button>
      <button class="btn ${show}" id="lobby-start" disabled="disabled">START</button>
    </div>
  `;
  return div;
};