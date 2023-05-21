/* eslint-disable guard-for-in */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import {dijkstraAlgo, tracker, path} from './dijkstra.js';
// CREATING THE GRID AND COORDINATE SYSTEM FOR EACH CELL

const grid = document.getElementById('grid');
const gridCellsNo = 1200;
let i = 0;
let y = 0;
for (i=0; i < gridCellsNo; i++) {
  let x = i % 60;
  if (x == 0 && i != 0) {
    y++;
  };
  grid.innerHTML += `<div class='node' data-x=${x} data-y=${y} data-euclidean='' id=${i}></div>`;
  x++;
// i to identify the node that came before the one just discovered.
};

// create euclidean func for a*

const gridCells = Array.from(document.getElementsByClassName('node'));

// NAVBAR buttons
let algoBtnSelector = document.getElementById('algo-button').value;
const clearBoardBtn = document.getElementById('clearBoardBtn');
const clearPathBtn = document.getElementById('clearPathBtn');

// USER SELECTING A NODE FROM THE KEY
const keyForNodes = document.querySelector('#main .key');
const userNodeDivs = Array.from(document.querySelectorAll('#main .key .user-slct'));
const hiddenField = document.getElementById('hiddenField');

// To populate hidden field when user clicks on which node they want to place in the grid
const startNodeMouseOver = '<img src="../PathFindingVisualiser/images/right-arrow.png" class="mouseover-grid-icons">';
const targetNodeMouseOver = '<img src="../PathFindingVisualiser/images/target.png" class="mouseover-grid-icons" id="icon-target">';
const weightNodeMouseOver = '<img src="../PathFindingVisualiser/images/weight.png" class="mouseover-grid-icons" id="icon-weight">';
const bombNodeMouseOver = '<img src="../PathFindingVisualiser/images/bomb.png" class="mouseover-grid-icons" id="icon-bomb">';
const wallNodeMouseOver = '<div class="mouseover-grid-icons" id="wall-node"></div>';

// ADDING HOVER EFFECT IN GRID FOR SELECTED NODE
const startNodeSelect = '<img src="../PathFindingVisualiser/images/right-arrow.png" class="selectedCell">';
const targetNodeSelect = '<img src="../PathFindingVisualiser/images/target.png" class="selectedCell" id="icon-target">';
const weightNodeSelect = '<img src="../PathFindingVisualiser/images/weight.png" class="selectedCell" id="icon-weight">';
const bombNodeSelect = '<img src="../PathFindingVisualiser/images/bomb.png" class="selectedCell" id="icon-bomb">';
const wallNodeSelect = '<div class="selectedCell" id="wall-node"></div>';


// SELECTING an algorithm to visualise and giving it the delay chosen by user
const addDelay = async (userChoice) => {
  switch (userChoice) {
    case 'fast':
      await delay(2);
      return;
    case 'medium':
      await delay(20);
      return;
    case 'slow':
      await delay(90);
      return;
  };
};

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  algoBtnSelector = 'dijkstra';
  const visualiseBtn = document.getElementById('visualise-btn');
  visualiseBtn.addEventListener('click', (e) => {
    let startCell;

    if (e.target == visualiseBtn) {
      gridCells.forEach((gridcell) => {
        if (gridcell.innerHTML == startNodeSelect) {
          gridcell.classList.add('start');
          gridcell.id += ' start';
          startCell = gridcell;
        };
      });

      if (startCell == undefined) { // May change later. Can we do this without knowing where the target is?
        alert('Please place a start in the grid to visualise an algorithm');
        return;
      };

      switch (algoBtnSelector) {
        case 'dijkstra':
          dijkstraAlgo(startCell);
          break;

        default:
          break;
      };
    };
  });

  clearBoardBtn.addEventListener('click', (e) => {
    if (e.target == clearBoardBtn) {
      switch (algoBtnSelector) {
        case 'dijkstra':
          for (let i = 0; i < gridCells.length; i++) {
            gridCells[i].innerHTML = '';
            gridCells[i].className = '';
            gridCells[i].id = i;
            gridCells[i].classList.add('node');
          };
          for (const id in tracker) {
            delete tracker[id];
          };
          path.length = 0;
          break;
        default:
          break;
      };
    };
  });

  keyForNodes.addEventListener('click', (e) => {
    let i = 0;
    for (i = 0; i < userNodeDivs.length; i++) {
      const iconsAndText = Array.from(userNodeDivs[i].children);
      if (userNodeDivs[i] == e.target || iconsAndText.includes(e.target)) {
        switch (userNodeDivs[i].lastElementChild.innerText) {
          case 'Start Node':
            hiddenField.value = startNodeSelect;
            break;
          case 'Target Node':
            hiddenField.value = targetNodeSelect;
            break;
          case 'Bomb Node':
            hiddenField.value = bombNodeSelect;
            break;
          case 'Weight Node':
            hiddenField.value = weightNodeSelect;
            break;
          case 'Wall Node':
            hiddenField.value = wallNodeSelect;
            break;
        };
      };
    };
  });

  const nodeArray = [startNodeMouseOver, targetNodeMouseOver, weightNodeMouseOver, bombNodeMouseOver, wallNodeMouseOver];
  /* function to add inner html to the grid cell is used for hover and for click */
  function hiddenFieldValue(gridcell) {
    switch (hiddenField.value) {
      case startNodeSelect:
        gridcell.innerHTML = startNodeMouseOver;
        break;
      case targetNodeSelect:
        gridcell.innerHTML = targetNodeMouseOver;
        break;

      case bombNodeSelect:
        gridcell.innerHTML = bombNodeMouseOver;
        break;

      case weightNodeSelect:
        gridcell.innerHTML = weightNodeMouseOver;
        break;
    };
  };

  grid.addEventListener('mouseover', (e) => {
    gridCells.forEach((gridcell) => {
      if (e.target == gridcell.firstElementChild) {
        return;
      };

      if (gridcell.innerHTML == '' && e.target == gridcell) {
        hiddenFieldValue(gridcell);
      };

      if (nodeArray.includes(gridcell.innerHTML) && gridcell != e.target) {
        gridcell.innerHTML = '';
      };
    });
  });

  // ADDING SELECTED ICON INTO A GRID CELL

  // WALL NODES
  let mouseDown;
  grid.addEventListener('mousedown', (e) => {
    if (hiddenField.value == wallNodeSelect && e.target.classList.contains('wall-node')) {
      console.log(e.target);
      mouseDown = true;
      e.target.classList.remove('wall-node');
      return;
    };

    if (hiddenField.value == wallNodeSelect) {
      mouseDown = true;
      e.target.classList.add('wall-node');
    };
  });

  grid.addEventListener('mouseup', (e) => {
    mouseDown = false;
  });

  grid.addEventListener('mouseover', (e) => {
    if (mouseDown == true && e.target.classList.contains('wall-node')) {
      e.target.classList.remove('wall-node');
      return;
    };

    if (mouseDown == true && e.target.classList.contains('node')) {
      e.target.classList.add('wall-node');
    };
  });

  // EVERY OTHER NODE
  grid.addEventListener('click', (e) => {
    placeNodeInGridCell(e, hiddenField.value);
  });

  const placeNodeInGridCell = (e, hiddenfieldValue) => {
    gridCells.forEach((gridcell) => {
    // compare the innerhtml of the cell to the hidden field value

      if (hiddenField.value == wallNodeSelect) {
        return;
      }

      // removing a placed node from a gridcell
      if ((e.target != gridcell.firstElementChild) && gridcell.innerHTML == hiddenfieldValue) {
        gridcell.innerHTML = '';
      };

      // adding a different node to a new gridcell
      if ((e.target == gridcell || e.target == gridcell.firstElementChild) && gridcell.innerHTML != hiddenfieldValue) {
        gridcell.innerHTML = hiddenField.value;
      };
    });
  };

  // CLEAR PATH BUT NOT WALLS AND WEIGHTS
  clearPathBtn.addEventListener('click', () => {
    gridCells.forEach((gridcell) => {
      if (gridcell.classList.contains('visited-node-1') || gridcell.classList.contains('shortest-path-node')) {
        gridcell.classList.remove('visited-node-1');
        gridcell.classList.remove('shortest-path-node');
        for (const id in tracker) { // POTENTIALLY TURN THIS INTO FUNCTION if other algos use these variables
          delete tracker[id];
        };
        path.length = 0;
      };
    });
  });
});

export {gridCells, startNodeSelect, targetNodeSelect, addDelay};

// TO DO:
// - improve animations
// - change arrow rotation
// - caclulate number of rotations
// - fix clearboard btn
// - add weights
// - add bomb
// - add mazes and patterns
// - clear walls and weights button
// - drag and drop target once path is calculated
// - iteration


// euclidean distance for a*
