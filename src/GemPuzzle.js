/* eslint-disable import/extensions */
import Field from './Field.js';

export default class GemPuzzle {
  constructor(size) {
    this.size = size || 4;
    this.gameField = null;
    this.zeroPos = 0;
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

    this.selectAllowed();
  }

  createSettingPannel() {
    const settingPanel = document.createElement('div');
    settingPanel.classList.add('setting');

    const buttonText = ['Перемешать и начать', 'Стоп', 'Сохранить', 'Результаты'];
    const buttonId = ['start', 'stop', 'save', 'results'];

    for (let i = 0; i < buttonText.length; i += 1) {
      const button = document.createElement('button');
      button.classList.add('setting__btn');
      button.id = buttonId[i];
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
    const statisticsCountId = ['moves', 'time'];

    for (let i = 0; i < statisticsText.length; i += 1) {
      const field = document.createElement('span');
      field.classList.add('statistics__text');
      field.textContent = statisticsText[i];

      const сount = document.createElement('span');
      сount.classList.add('statistics__count');
      сount.id = statisticsCountId[i];
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
    const numberArray = Array(numberOfTiles).fill().map((e, i) => i);
    const numberOfTilesArr = [];

    while (numberArray.length) {
      const number = numberArray.splice(Math.floor(Math.random() * numberArray.length), 1)[0];
      numberOfTilesArr.push(number);
    }

    numberOfTilesArr.forEach((e, i) => {
      const tile = document.createElement('div');
      tile.classList.add('field__tile');

      if (e === 0) {
        tile.classList.add('tile_space');
        this.zeroPos  = i;
      } else {
        tile.textContent = e;
      }

      this.gameField.append(tile);
    });


  }

  addListeners() {
    const startBtn = document.getElementById('start');
    startBtn.addEventListener('click', this.startBtnHandler.bind(this));

    const stopBtn = document.getElementById('stop');
    stopBtn.addEventListener('click', this.stopBtnHandler.bind(this));

    const saveBtn = document.getElementById('save');
    saveBtn.addEventListener('click', this.saveBtnHandler.bind(this));

    const resultsBtn = document.getElementById('results');
    resultsBtn.addEventListener('click', this.resultsBtnHandler.bind(this));

    this.gameField.addEventListener('click', this.clickFieldHandler.bind(this));
  }


  startBtnHandler() {
    this.gameField.innerHTML = '';
    this.addTilesToField();
  }

  stopBtnHandler() {

  }

  saveBtnHandler() {

  }

  resultsBtnHandler() {

  }

  selectAllowed() {
    const zeroPos = this.zeroPos;
    const size = this.size;
    const allowedPos = [];

    if (zeroPos > size - 1) {
      allowedPos.push(zeroPos - size);
    }

    if (zeroPos % size > 0) {
      allowedPos.push(zeroPos - 1);
    }

    if (zeroPos % size < size - 1) {
      allowedPos.push(zeroPos + 1);
    }

    if (zeroPos < size ** 2 - size) {
      allowedPos.push(zeroPos + size);
    }

    allowedPos.forEach(e => {
      const selectedTile = this.gameField.querySelector(`.field__tile:nth-child(${e + 1})`);
      selectedTile.classList.add('tile_allowed');
    });
  }

  clickFieldHandler(event) {
    const target = event.target;

    if (target.closest('.tile_allowed')) {
      this.swapWithZeroTile(target);
    }
  }

  swapWithZeroTile(target) {
    const cloneTarget = target.cloneNode(true);
    const zeroTile = this.gameField.querySelector(`.field__tile:nth-child(${this.zeroPos + 1})`)
    const cloneZeroTile = zeroTile.cloneNode(true);

    Array.prototype.forEach.call(target.parentNode.childNodes, (e, i) => {
      if (target === e) {
        this.zeroPos = i;
      }
    });

    this.gameField.replaceChild(cloneTarget, zeroTile);
    this.gameField.replaceChild(cloneZeroTile, target);

    const movesCount = document.getElementById('moves');
    movesCount.textContent = +movesCount.textContent + 1;

    this.clearAllowed();
    this.checkWin();
    this.selectAllowed();
  }

  clearAllowed() {
    const tiles = document.querySelectorAll('.field__tile');
    tiles.forEach(tile => {
      tile.classList.remove('tile_allowed');
    })
  }

  checkWin() {

  }

}

