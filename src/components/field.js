import { createCell } from "../utilityFNs.js";

export default (id, mode) => {
  const field = document.createElement('div');
  field.classList.add('field');
  field.id = `field${id}`;

  for (let i = 0; i < 250; i += 1) {
    const cell = createCell(i);
    field.append(cell);
  }
  if (mode === 'multiplayer') {
    const fieldHeader = document.createElement('div');
    fieldHeader.classList.add('field-header');
    fieldHeader.innerHTML = `
      <span>Player ${id}</span>
      <span class="score-${id}">Score: 0</span>
    `;
    field.append(fieldHeader);
  }

  return field;
}