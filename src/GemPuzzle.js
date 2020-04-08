/* eslint-disable import/extensions */
import Field from './Field.js';

export default class GemPuzzle {
  constructor(size) {
    this.size = size || 4;
    this.field = null;

  }

  renderGame() {
    const container = document.createElement('div');
    container.classList.add('container');

    const controlPanel = this.createSettingPannel();
    const statisticsPanel = this.createStatisticsPannel();

    // const field = new Field();
    this.field  = document.createElement('div');
    this.field.classList.add('field');

    this.addTilesToField();

    container.append(controlPanel, statisticsPanel, this.field);
    document.body.prepend(container);
  }

  createSettingPannel() {
    const settingPanel = document.createElement('div');
    settingPanel.classList.add('setting');

    const buttonText = ['Перемешать и начать', 'Стоп', 'Сохранить', 'Результаты'];
    const buttonClass = ['Start', 'Stop', 'Save', 'Results'];

    for (let i = 0; i < buttonText.length; i += 1) {
      const button = document.createElement('button');
      button.classList.add('setting-btn', buttonClass[i]);
      button.textContent = buttonText[i];
      settingPanel.append(button);
    }

    return settingPanel;
  }

  createStatisticsPannel() {
    const statisticsPanel = document.createElement('div');
    statisticsPanel.classList.add('statistics');

    const moves = document.createElement('span');
    moves.classList.add('statistics-text');
    moves.textContent = 'Ходов: ';
    const movesCount = document.createElement('span');
    movesCount.classList.add('statistics-count');
    movesCount.textContent = '0';
    moves.append(movesCount);

    const time = document.createElement('span');
    time.classList.add('statistics-text');
    time.textContent = 'Время: ';
    const timeCount = document.createElement('span');
    timeCount.classList.add('statistics-count');
    timeCount.textContent = '00:00';
    time.append(timeCount);

    statisticsPanel.append(moves, time);

    return statisticsPanel;
  }

  addTilesToField() {
    const numberOfTiles = this.size ** 2;


    let tilesArray = Array(numberOfTiles);
    tilesArray.fill('1');
    let num = tilesArray.map((e, i) => i);

    console.log(num);

  }


  

}

