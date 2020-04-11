export default class GemPuzzle {
  constructor() {
    this.size = 4;
    this.gameField = null;
    this.zeroPos = 0;
    this.timerInterval = 0;
    this.dragged = null;
    this.isStarted = false;
    this.savedData = null;
  }

  renderGame() {
    this.checkSavedData();

    const container = document.createElement('div');
    container.classList.add('container');

    const controlPanel = this.createSettingPannel();
    const statisticsPanel = this.createStatisticsPannel();
    const sizePannel = this.createSizePannel();
    const modal = this.createModal();

    this.gameField  = document.createElement('div');
    this.gameField.classList.add('field');
    this.gameField.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`

    if (this.savedData) {
      const numberOfTilesArr = this.savedData.arrNumbersOfTiles;
      this.addTilesToField(numberOfTilesArr);
    } else {
      this.createRandomField();
    }

    container.append(controlPanel, statisticsPanel, this.gameField, sizePannel, modal);
    document.body.prepend(container);

    if (this.isStarted && this.savedData) {
      if (document.getElementById('time').textContent !== '00:00' ) {
        this.startTime();
      } else {
        this.isStarted = false;
      }
    }
  }

  checkSavedData() {
    const savedData = JSON.parse(localStorage.getItem('GemPuzzle'));

    if (savedData) {
      this.savedData = savedData;
      this.size = savedData.size;
      this.zeroPos = savedData.zeroPos;
      this.isStarted = true;
    }
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
    let statisticsCount = ['0', '00:00'];

    if (this.savedData) {
      statisticsCount = [this.savedData.movesCount, `${this.savedData.min}:${this.savedData.sec}`];
    } else {
      statisticsCount = ['0', '00:00'];
    }

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

  createModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal__overlay');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal__content');

    const modalText = document.createElement('div');
    modalText.classList.add('modal__text');

    const modalBtn = document.createElement('button');
    modalBtn.classList.add('modal__btn');
    modalBtn.textContent = 'OK';

    modalContent.append(modalText, modalBtn);
    modal.append(modalContent);

    return modal;
  }

  createRandomField() {
    const numberOfTiles = this.size ** 2;
    const numberArray = Array(numberOfTiles).fill().map((e, i) => i);
    const numberOfTilesArr = [];

    while (numberArray.length) {
      const number = numberArray.splice(Math.floor(Math.random() * numberArray.length), 1)[0];
      numberOfTilesArr.push(number);
    }

    this.addTilesToField(numberOfTilesArr)
  }

  addTilesToField(numberOfTilesArr) {

    numberOfTilesArr.forEach((e, i) => {
      const tile = document.createElement('div');
      tile.classList.add('field__tile');

      if (+e === 0) {
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

    const modalBtn = document.querySelector('.modal__btn');
    modalBtn.addEventListener('click', this.modalBtnHandler.bind(this));

    this.gameField.addEventListener('click', this.clickFieldHandler.bind(this));

    this.gameField.addEventListener('dragstart', this.dragStartHandler.bind(this));
    this.gameField.addEventListener('dragover', this.dragOverHandler.bind(this));
    this.gameField.addEventListener('drop', this.dropHandler.bind(this));
    this.gameField.addEventListener('dragend', this.dragEndHandler.bind(this));
  }

  startBtnHandler() {
    this.isStarted = true;
    this.restartGameField();
  }

  stopBtnHandler() {
    this.isStarted = false;
    this.resetCountres();
  }

  saveBtnHandler() {
    const arrNumbersOfTiles = Array.prototype.map.call(this.gameField.childNodes, (tile) => {
      return tile.textContent;
    });

    const movesCount = document.getElementById('moves').textContent;
    const timer = document.getElementById('time').textContent;
    const [ min, sec ] = timer.split(':');

    const dataForSave = {
      size: this.size,
      zeroPos: this.zeroPos,
      arrNumbersOfTiles,
      movesCount,
      min,
      sec,
    }

    const serialData = JSON.stringify(dataForSave)
    localStorage.setItem('GemPuzzle', serialData);

    this.showModal('Игра сохранена!');
  }

  resultsBtnHandler() {
    const savedData = JSON.parse(localStorage.getItem('GemPuzzleRecord'));
    let modalContent = 'Результаты:<br>';

    if (savedData) {
      savedData.forEach((e, i) => {
        modalContent += `${i + 1}. Ходов: ${e[0]}, время ${e[1]}<br>`;
      })


    } else {
      modalContent = 'Реультатов пока нет:('
    }

    this.showModal(modalContent);
  }

  showModal(content) {
    const modal = document.querySelector('.modal__overlay');
    const modalText = document.querySelector('.modal__text');
    modalText.innerHTML = content || '';
    modal.classList.add('modal__overlay_show');
  }

  sizePannelHandler(event) {
    const target = event.target;

    if (target.classList.contains('size-pannel__text')) {
      this.size = +target.dataset.sizeField;
      this.isStarted = false;
      this.restartGameField();
    }
  }

  modalBtnHandler() {
    const modal = document.querySelector('.modal__overlay');
    modal.classList.remove('modal__overlay_show');
  }

  resetCountres() {
    clearInterval(this.timerInterval);
    const timer = document.getElementById('time');
    timer.textContent = '00:00';

    const movesCount = document.getElementById('moves');
    movesCount.textContent = 0;
  }

  restartGameField() {
    this.gameField.innerHTML = '';
    this.gameField.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`

    this.resetCountres();
    this.createRandomField();

    if (this.isStarted) {
      this.startTime();
    }
  }

  selectAllowed() {
    const zeroPos = this.zeroPos;
    const size = this.size;
    const allowedPos = [];

    if (zeroPos > size - 1) {
      allowedPos.push([zeroPos - size, 'to-bottom']);
    }

    if (zeroPos % size > 0) {
      allowedPos.push([zeroPos - 1, 'to-right']);
    }

    if (zeroPos % size < size - 1) {
      allowedPos.push([zeroPos + 1, 'to-left']);
    }

    if (zeroPos < size ** 2 - size) {
      allowedPos.push([zeroPos + size, 'to-top']);
    }

    allowedPos.forEach(e => {
      const selectedTile = this.gameField.querySelector(`.field__tile:nth-child(${e[0] + 1})`);
      selectedTile.classList.add('tile_allowed');
      selectedTile.dataset.direction = e[1];
      selectedTile.draggable = 'true';
    });
  }

  clickFieldHandler(event) {
    if (!this.isStarted) {
      return;
    }

    const target = event.target;
    const direction = target.dataset.direction;

    if (target.closest('.tile_allowed')) {
      target.classList.add(direction);
      this.isStarted = false;

      target.addEventListener('animationend', () => {
        target.classList.remove(direction);
        this.isStarted = true;
        this.swapWithZeroTile(target);
      }), { once: true };
    }
  }

  swapWithZeroTile(target) {
    if (!this.isStarted) {
      return;
    }

    const cloneTarget = target.cloneNode(true);

    const zeroTile = this.gameField.querySelector('.tile_space');
    const cloneZeroTile = zeroTile.cloneNode(true);

    Array.prototype.forEach.call(target.parentNode.childNodes, (e, i) => {
      if (target === e) {
        this.zeroPos = i;
      }
    });

    this.gameField.replaceChild(cloneZeroTile, target);
    this.gameField.replaceChild(cloneTarget, zeroTile);

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
    const tiles = this.gameField.childNodes

    const isWin = Array.prototype.every.call(tiles, (tile, i) => {
      if (i === tiles.length - 1) {
        return +tile.textContent === 0;
      } else {
        return +tile.textContent === i + 1;
      }
    });

    if (isWin) {
      const movesCount = document.getElementById('moves').textContent;
      const timer = document.getElementById('time').textContent;

      this.showModal(`Ура! Вы решили головоломку за ${timer} и ${movesCount} ходов!`);

      this.addNewRecord(+movesCount, timer);

      this.restartGameField();
    }
  }

  addNewRecord(movesCount, timer) {
    const savedData = JSON.parse(localStorage.getItem('GemPuzzleRecord'));
    let dataForSave = [];

    if (savedData) {
      dataForSave = savedData;

      let i;

      for (i = 0; i < dataForSave.length; i += 1) {
        if (+movesCount < +dataForSave[i][0]) {
          break;
        }
      }

      dataForSave.splice(i, 0, [movesCount, timer])
    } else {
      dataForSave.push([movesCount, timer,]);
    }

    if (dataForSave.length > 10 ) {
      dataForSave.length = 10
    }

    const serialData = JSON.stringify(dataForSave)
    localStorage.setItem('GemPuzzleRecord', serialData);
  }


  startTime() {
    let timer = document.getElementById('time');

    const [ m, s ] = timer.textContent.split(':');

    let min = +m;
    let sec = +s;

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
    if (!this.isStarted) {
      return;
    }

    const target = event.target;
    this.dragged = target;
    event.dataTransfer.effectAllowed = 'move';
    target.classList.add('tile_dragged');
  }

  dragOverHandler(event) {
    if (!this.isStarted) {
      return;
    }

    const target = event.target;

    if (target.classList.contains('tile_space')) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }
  }

  dropHandler(event) {
    if (!this.isStarted) {
      return;
    }

    const target = event.target;

    if (target.classList.contains('tile_space')) {
      this.dragged.classList.remove('tile_dragged');
      this.swapWithZeroTile(this.dragged);
    }
  }

  dragEndHandler(event) {
    if (!this.isStarted) {
      return;
    }

    const target = event.target;
    target.classList.remove('tile_dragged');
  }
}
