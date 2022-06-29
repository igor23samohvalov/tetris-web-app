export const getPlayers = ({players, ready}) => {
  return players.reduce((acc, current) => {
    const yesIcon = '<i class="gg-check-o"></i>';
    const noIcon = '<i class="gg-close-o"></i>'
    let icon = ready.includes(current) ? yesIcon : noIcon;
  
    acc.push(`
      <div>
        <span># ${current}</span>
        ${icon}
      </div>
    `);
    return acc;
  }, []);
}

export default (roomId, show) => {
  const div = document.createElement('div');
  div.classList.add('modal', 'lobby');
  
  div.innerHTML = `
    <div class="lobby-container">
      <h3>LOBBY ID: <span>${roomId}</span></h3>
      <div class="lobby-container">
          <h3>PLAYERS:</h3>
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