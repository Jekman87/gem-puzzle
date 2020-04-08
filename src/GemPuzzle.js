/* eslint-disable import/extensions */
import Field from './Field.js';

export default class GemPuzzle {
  constructor(size) {
    this.size = size || 4;
    this.gameField = null;

  }

  renderGame() {
    const container = document.createElement('div');
    container.classList.add('container');

    const controlPanel = this.createSettingPannel();
    const statisticsPanel = this.createStatisticsPannel();

    // const field = new Field();
    this.gameField  = document.createElement('div');
    this.gameField.classList.add('field');

    this.addTilesToField();

    container.append(controlPanel, statisticsPanel, this.gameField);
    document.body.prepend(container);
  }

  createSettingPannel() {
    const settingPanel = document.createElement('div');
    settingPanel.classList.add('setting');

    const buttonText = ['Перемешать и начать', 'Стоп', 'Сохранить', 'Результаты'];
    const buttonClass = ['Start', 'Stop', 'Save', 'Results'];

    for (let i = 0; i < buttonText.length; i += 1) {
      const button = document.createElement('button');
      button.classList.add('setting__btn', buttonClass[i]);
      button.textContent = buttonText[i];
      settingPanel.append(button);
    }

    return settingPanel;
  }

  createStatisticsPannel() {
    const statisticsPanel = document.createElement('div');
    statisticsPanel.classList.add('statistics');

    const statisticsText = ['Ходов: ', 'Время: '];
    const statisticsCount = ['0', '00:00'];

    for (let i = 0; i < statisticsText.length; i += 1) {
      const field = document.createElement('span');
      field.classList.add('statistics__text');
      field.textContent = statisticsText[i];

      const сount = document.createElement('span');
      сount.classList.add('statistics__count');
      сount.textContent = statisticsCount[i];

      field.append(сount);
      statisticsPanel.append(field);
    }

    const moves = document.createElement('span');
    moves.classList.add('statistics__text');
    moves.textContent = 'Ходов: ';
    const movesCount = document.createElement('span');
    movesCount.classList.add('statistics__count');
    movesCount.textContent = '0';
    moves.append(movesCount);

    return statisticsPanel;
  }

  addTilesToField() {
    const numberOfTiles = this.size ** 2;
    Array(numberOfTiles).fill('1').forEach((e, i) => {
      const tile = document.createElement('div');
      tile.classList.add('field__tile');
      tile.textContent = i;
      this.gameField.append(tile);
    });
  }


  addListeners() {
    document.addEventListener('keydown', this.keydownHandler.bind(this));
    document.addEventListener('keyup', this.keyupHandler.bind(this));

    this.keyboard.addEventListener('mousedown', this.mousedownHandler.bind(this));
    this.keyboard.addEventListener('mouseup', this.mouseupHandler.bind(this));

    this.textarea.addEventListener('blur', this.textarea.focus);
    this.textarea.focus();
  }

}

