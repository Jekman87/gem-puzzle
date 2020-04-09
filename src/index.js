/* eslint-disable import/extensions */
import GemPuzzle from './GemPuzzle.js';

function initialize() {
  const newGame = new GemPuzzle();
  newGame.renderGame();
  newGame.addListeners();
}

document.addEventListener('DOMContentLoaded', initialize);
