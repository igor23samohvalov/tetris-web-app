import { createCell } from "../lib/utilityFNs.js";

export default (id, mode) => {
  const field = document.createElement('div');
  field.classList.add('field');
  field.id = `field${id}`;

  for (let i = 0; i < 200; i += 1) {
    const cell = createCell(i);
    field.append(cell);
  }
  if (mode === 'multiplayer') {
    const fieldHeader = document.createElement('div');
    fieldHeader.classList.add('field-header');
    fieldHeader.innerHTML = `
      <span>${id}</span>
      <span class="score-${id}">SCORE: 0</span>
    `;
    field.append(fieldHeader);
  } else {
    field.classList.add('field-singleplayer');
  }

  return field;
}