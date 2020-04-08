/* eslint-disable import/extensions */
import GemPuzzle from './GemPuzzle.js';

function initialize() {
  const newGame = new GemPuzzle();
  newGame.renderGame();
}

document.addEventListener('DOMContentLoaded', initialize);
