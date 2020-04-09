/* eslint-disable import/extensions */
import Field from './Field.js';

export default class GemPuzzle {
  constructor(size) {
    this.size = size || 4;
    this.gameField = null;
    this.zeroPos = 0;
    this.timerInterval = 0;
    this.dragged = null;
  }

  renderGame() {
    const container = document.createElement('div');
    container.classList.add('container');

    const controlPanel = this.createSettingPannel();
    const statisticsPanel = this.createStatisticsPannel();
    const sizePannel = this.createSizePannel();

    this.gameField  = document.createElement('div');
    this.gameField.classList.add('field');

    this.addTilesToField();

    container.append(controlPanel, statisticsPanel, this.gameField, sizePannel);
    document.body.prepend(container);
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

  createSizePannel() {
    const sizePanel = document.createElement('div');
    sizePanel.classList.add('size-pannel');

    for (let i = 3; i < 9; i += 1) {
      const sizeText = document.createElement('span');
      sizeText.classList.add('size-pannel__text');
      sizeText.dataset.sizeField = i;
      sizeText.textContent = `${i}x${i}`;
      sizePanel.append(sizeText);
    }

    return sizePanel;
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
        tile.textContent = e;
        this.zeroPos  = i;
      } else {
        tile.textContent = e;
      }

      this.gameField.append(tile);
    });

    this.selectAllowed();
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

    const sizePannel = document.querySelector('.size-pannel');
    sizePannel.addEventListener('click', this.sizePannelHandler.bind(this));

    this.gameField.addEventListener('click', this.clickFieldHandler.bind(this));

    this.gameField.addEventListener('dragstart', this.dragStartHandler.bind(this));
    this.gameField.addEventListener('dragover', this.dragOverHandler.bind(this));
    this.gameField.addEventListener('drop', this.dropHandler.bind(this));
    this.gameField.addEventListener('dragend', this.dragEndHandler.bind(this));
    this.gameField.addEventListener('dragleave', this.dragLeaveHandler.bind(this));
  }

  startBtnHandler() {
    this.restartGameField();
  }

  stopBtnHandler() {
    clearInterval(this.timerInterval);
    const timer = document.getElementById('time');
    timer.textContent = '00:00';

    const movesCount = document.getElementById('moves');
    movesCount.textContent = 0;
  }

  saveBtnHandler() {

  }

  resultsBtnHandler() {

  }

  sizePannelHandler(event) {
    const target = event.target;
    this.size = +target.dataset.sizeField;
    this.restartGameField();
  }

  restartGameField() {
    this.gameField.innerHTML = '';
    this.gameField.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`

    const movesCount = document.getElementById('moves');
    movesCount.textContent = 0;

    this.addTilesToField();
    clearInterval(this.timerInterval);
    this.startTime();
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
      selectedTile.draggable = 'true';
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
      tile.removeAttribute('draggable');
    });
  }

  checkWin() {
    const isWin = Array.prototype.every.call(this.gameField.childNodes, (tile, i) => {
      return +tile.textContent === i;
    });

    //console.log(isWin);
  }

  startTime() {
    const timer = document.getElementById('time');

    let sec = 0;
    let min = 0;

    function tick() {
      sec += 1

      if (sec === 60) {
        sec = 0;
        min += 1;
      }

      if (min === 60) {
        sec = 0;
        min = 0;
      }

      timer.textContent = `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    }

    this.timerInterval = setInterval(tick, 1000);
  }

  dragStartHandler(event) {
    const target = event.target;
    this.dragged = target;
    event.dataTransfer.effectAllowed = 'move';
    target.classList.add('tile_dragged');
  }

  dragOverHandler(event) {
    const target = event.target;

    if (target.classList.contains('tile_space')) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      target.classList.add('tile_over');
    }
  }

  dropHandler(event) {
    const target = event.target;

    if (target.classList.contains('tile_space')) {
      this.dragged.classList.remove('tile_dragged');
      target.classList.remove('tile_over');
      this.swapWithZeroTile(this.dragged);
    }
  }

  dragEndHandler(event) {
    const target = event.target;
    target.classList.remove('tile_dragged');
  }

  dragLeaveHandler(event) {
    const target = event.target;
    target.classList.remove('tile_over');
  }
}
