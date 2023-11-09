import Handsontable from "handsontable";

const addClassWhenNeeded = (td, cellProperties) => {
  const className = cellProperties.className;

  if (className !== undefined) {
    Handsontable.dom.addClass(td, className);
  }
};

export function progressBarRenderer(
  _instance,
  td,
  _row,
  _column,
  _prop,
  value,
  cellProperties
) {
  const div = document.createElement("div");

  div.style.width = `${value * 10}px`;
  div.ariaLabel = `${value * 10}%`;

  addClassWhenNeeded(td, cellProperties);
  Handsontable.dom.addClass(div, "progressBar");
  Handsontable.dom.empty(td);

  td.appendChild(div);
}

export function starRenderer(
  _instance,
  td,
  _row,
  _column,
  _prop,
  value,
  _cellProperties
) {
  const div = document.createElement("div");
  div.textContent = "★".repeat(value);
  div.ariaLabel = `${value}`;
  Handsontable.dom.addClass(div, "stars");
  Handsontable.dom.empty(td);

  td.appendChild(div);
}