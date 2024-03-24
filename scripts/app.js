/* eslint-disable guard-for-in */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import { dijkstraAlgo } from './dijkstra.js';
import { aStarSearch } from './a*.js';
import { greedyBFS } from './greedyBFS.js';
import { breadthFS } from './breadthFS.js';
import { depthFirstSearch } from './depthFS.js';
import { bidirectionalBFS } from './bidirectionalBFS.js';

// CREATING THE GRID AND COORDINATE SYSTEM FOR EACH CELL AND ADDING DEFAULT START AND TARGET
export const path = [];
export const path2 = [];

const grid = document.getElementById('grid');
const gridCellsNo = 1200;
let i = 0;
let y = 0;
for (i = 0; i < gridCellsNo; i++) {
  let x = i % 60;
  if (x == 0 && i != 0) {
    y++;
  };
  grid.innerHTML += `<div class='node' data-x=${x} data-y=${y} data-direction='' data-path=''  data-aStar='' id=${i}></div>`;
  x++;
};
const startNodeSelect = '<img src="./images/right-arrow.png" class="selectedCell">';
const targetNodeSelect = '<img src="./images/target.png" class="selectedCell" id="icon-target">';
const defaultStart = document.getElementById('562');
defaultStart.innerHTML = startNodeSelect;
const defaultTarget = document.getElementById('578');
defaultTarget.innerHTML = targetNodeSelect;

const gridCells = Array.from(document.getElementsByClassName('node'));

// NAVBAR buttons
const algoBtnSelector = document.getElementById('algo-button');
const clearBoardBtn = document.getElementById('clearBoardBtn');
const clearPathBtn = document.getElementById('clearPathBtn');

// USER SELECTING A NODE FROM THE KEY
const keyForNodes = document.querySelector('#main .key');
const userNodeDivs = Array.from(document.querySelectorAll('#main .key .user-slct'));
const hiddenField = document.getElementById('hiddenField');

// To populate hidden field when user clicks on which node they want to place in the grid
const startNodeMouseOver = '<img src="./images/right-arrow.png" class="mouseover-grid-icons">';
const targetNodeMouseOver = '<img src="./images/target.png" class="mouseover-grid-icons">';
const weightNodeMouseOver = '<img src="./images/weight.png" class="mouseover-grid-icons">';
const bombNodeMouseOver = '<img src="./images/flag.png" class="mouseover-grid-icons">';
const wallNodeMouseOver = '<div class="mouseover-grid-icons" id="wall-node"></div>';

// ADDING HOVER EFFECT IN GRID FOR SELECTED NODE
const weightNodeSelect = '<img src="./images/weight.png" class="selectedCell">';
const bombNodeSelect = '<img src="./images/flag.png" class="selectedCell" id="icon-bomb">';
const wallNodeSelect = '<div class="selectedCell" id="wall-node"></div>';


// SELECTING an algorithm to visualise and giving it the delay chosen by user
const addDelay = async (userChoice) => {
  switch (userChoice) {
    case 'fast':
      await delay(2);
      return;
    case 'medium':
      await delay(30);
      return;
    case 'slow':
      await delay(910);
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
  const visualiseBtn = document.getElementById('visualise-btn');
  visualiseBtn.addEventListener('click', (e) => {
    let startCell;
    let isBomb = false;
    let goalNode;

    if (e.target == visualiseBtn) {
      gridCells.forEach((gridcell) => {
        if (gridcell.innerHTML == startNodeSelect) {
          gridcell.id += ' start';
          startCell = gridcell;
        };

        if (gridcell.innerHTML == bombNodeSelect) {
          isBomb = true;
        };

        if (gridcell.innerHTML == targetNodeSelect) {
          goalNode = gridcell;
        };
      });


      switch (algoBtnSelector.value) {
        case 'dijkstra':
          dijkstraAlgo(startCell, '1', isBomb, false);
          break;

        case 'A* search':
          aStarSearch(startCell, '1', isBomb, false);
          break;

        case 'Greedy Best-first Search':
          greedyBFS(startCell, '1', isBomb, false);
          break;

        case 'Breadth-first search':
          breadthFS(startCell, '1', isBomb, false);
          break;

        case 'Depth-first search':
          depthFirstSearch(startCell, '2', isBomb, false);
          break;

        case 'Bidirectional BFS':
          goalNode.id += ' goal';
          bidirectionalBFS(startCell, goalNode);
          break;

        default:
          break;
      };
    };
  });

  clearBoardBtn.addEventListener('click', (e) => {
    if (e.target == clearBoardBtn) {
      for (let i = 0; i < gridCells.length; i++) {
        gridCells[i].innerHTML = '';
        gridCells[i].className = '';
        gridCells[i].id = i;
        gridCells[i].classList.add('node');
      };
      path.length = 0;
      path2.length = 0;
      defaultStart.innerHTML = startNodeSelect;
      defaultTarget.innerHTML = targetNodeSelect;
    };
  });

  const highlightKey = (div, nodeSelect) => {
    // if it is that div's node select, remove the green class from that div and clear hidden field
    if (hiddenField.value == nodeSelect) {
      div.classList.remove('selected-key-node');
      hiddenField.value = '';

      if (nodeSelect == bombNodeSelect) {
        const bombNode = document.querySelector('#main #grid .node #icon-bomb');
        bombNode.parentElement.innerHTML = '';
      };

      return;
    };

    // if it is empty or not that div's NodeSelect, set it to that div's NodeSelect
    if (hiddenField.value !== '') {
      const selectedDiv = document.querySelector('#main .key .user-slct.selected-key-node');
      selectedDiv.classList.remove('selected-key-node');
    };

    div.classList.add('selected-key-node');
    hiddenField.value = nodeSelect;
  };

  keyForNodes.addEventListener('click', (e) => {
    let i = 0;
    for (i = 0; i < userNodeDivs.length; i++) {
      const iconsAndText = Array.from(userNodeDivs[i].children);
      if (userNodeDivs[i] == e.target || iconsAndText.includes(e.target)) {
        switch (userNodeDivs[i].lastElementChild.innerText) {
          case 'Start':
            // hiddenField.value = startNodeSelect;
            highlightKey(userNodeDivs[i], startNodeSelect);
            break;
          case 'Target':
            // hiddenField.value = targetNodeSelect;
            highlightKey(userNodeDivs[i], targetNodeSelect);
            break;
          case 'Flag':
            // hiddenField.value = bombNodeSelect;
            highlightKey(userNodeDivs[i], bombNodeSelect);
            break;
          case 'Weights':
            // hiddenField.value = weightNodeSelect;
            highlightKey(userNodeDivs[i], weightNodeSelect);
            break;
          case 'Walls':
            // hiddenField.value = wallNodeSelect;
            highlightKey(userNodeDivs[i], wallNodeSelect);
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

  // ADDING A USER SELECTED ICON INTO A GRID CELL

  // WALL NODES
  let mouseDown;
  grid.addEventListener('mousedown', (e) => {
    if (hiddenField.value == wallNodeSelect && e.target.classList.contains('wall-node')) {
      mouseDown = true;
      e.target.classList.remove('wall-node');
      return;
    };

    if (hiddenField.value == wallNodeSelect) {
      mouseDown = true;
      e.target.classList.add('wall-node');
    };

    if (hiddenField.value == weightNodeSelect && e.target.classList.contains('weight-node')) {
      mouseDown = true;
      e.target.classList.remove('weight-node');
      return;
    };

    if (hiddenField.value == weightNodeSelect) {
      mouseDown = true;
      e.target.classList.add('weight-node');
    }
  });

  grid.addEventListener('mouseup', () => {
    mouseDown = false;
  });

  grid.addEventListener('mouseover', (e) => {
    if (mouseDown == true && e.target.classList.contains('wall-node')) {
      e.target.classList.remove('wall-node');
      return;
    };

    if (mouseDown == true && hiddenField.value == wallNodeSelect) {
      e.target.classList.add('wall-node');
    };

    if (mouseDown == true && e.target.classList.contains('weight-node')) {
      e.target.classList.remove('weight-node');
      return;
    };

    if (mouseDown == true && hiddenField.value == weightNodeSelect) {
      e.target.classList.add('weight-node');
    };
  });

  // EVERY OTHER NODE, WEIGHT NODES HAVE THEIR OWN FUNCTION
  grid.addEventListener('click', (e) => {
    placeNodeInGridCell(e, hiddenField.value);
  });

  const placeNodeInGridCell = (e, hiddenfieldValue) => {
    gridCells.forEach((gridcell) => {
      // compare the innerhtml of the cell to the hidden field value

      if (hiddenField.value == wallNodeSelect) {
        return;
      }

      if (hiddenField.value == weightNodeSelect) {
        addRemoveWeightNode(e, gridcell);
        return;
      }

      // removing a placed start/target from a gridcell
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
      if (gridcell.classList.contains('visited-node-1') || gridcell.classList.contains('shortest-path-node') ||
        gridcell.classList.contains('discovered-node') || gridcell.classList.contains('visited-node-2') ||
        gridcell.classList.contains('discovered-node-2') || gridcell.classList.contains('shortest-path-node-2')) {
        gridcell.classList.remove('visited-node-1');
        gridcell.classList.remove('shortest-path-node');
        gridcell.classList.remove('shortest-path-node-2');
        gridcell.classList.remove('discovered-node');
        gridcell.id = gridcell.id.replace(' start', '');
        path.length = 0;
        path2.length = 0;
        gridcell.id = gridcell.id.replace(' bomb', '');
        gridcell.id = gridcell.id.replace(' goal', '');
        gridcell.classList.remove('visited-node-2');
        gridcell.classList.remove('discovered-node-2');
      };
    });
  });
});

export { gridCells, startNodeSelect, targetNodeSelect, addDelay, weightNodeSelect, bombNodeSelect };

// TO DO:
// - improve animations
// - change arrow rotation
// - add mazes and patterns
// - clear walls and weights button
