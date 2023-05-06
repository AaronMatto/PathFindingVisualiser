/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import {dijkstra} from './dijkstra.js';
// CREATING THE GRID AND COORDINATE SYSTEM FOR EACH CELL
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const gridCellsNo = 1200;
  let i = 0;
  let y = 0;
  for (i=0; i < gridCellsNo; i++) {
    let x = i % 60;
    if (x == 0 && i != 0) {
      y++;
    };
    grid.innerHTML += `<div class='node' data-x=${x} data-y=${y} id=${i}></div>`;
    x++;
  // i for dijkstra's algorithm to identify the node that came before the one just discovered.
  };
  const gridCells = Array.from(document.getElementsByClassName('node'));


  // SELECTING an algorithm to visualise
  const algoDropdown = document.getElementById('algo-button');
  algoDropdown.addEventListener('change', (e) => {
    switch (algoDropdown.value) {
      case 'dijkstra':
        dijkstra();
    };
  });


  // USER SELECTING A NODE FROM THE KEY
  const keyForNodes = document.querySelector('#main .key');
  const userNodeDivs = Array.from(document.querySelectorAll('#main .key .user-slct'));
  const hiddenField = document.getElementById('hiddenField');

  // To populate hidden field when user clicks on which node they want to place in the grid
  const startNodeMouseOver = '<img src="icons/right-arrow.png" class="mouseover-grid-icons">';
  const targetNodeMouseOver = '<img src="icons/target.png" class="mouseover-grid-icons" id="icon-target">';
  const weightNodeMouseOver = '<img src="icons/weight.png" class="mouseover-grid-icons" id="icon-weight">';
  const bombNodeMouseOver = '<img src="icons/bomb.png" class="mouseover-grid-icons" id="icon-bomb">';
  const wallNodeMouseOver = '<div class="mouseover-grid-icons" id="wall-node"></div>';

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

  // ADDING HOVER EFFECT IN GRID FOR SELECTED NODE
  const startNodeSelect = '<img src="icons/right-arrow.png" class="selectedCell">';
  const targetNodeSelect = '<img src="icons/target.png" class="selectedCell" id="icon-target">';
  const weightNodeSelect = '<img src="icons/weight.png" class="selectedCell" id="icon-weight">';
  const bombNodeSelect = '<img src="icons/bomb.png" class="selectedCell" id="icon-bomb">';
  const wallNodeSelect = '<div class="selectedCell" id="wall-node"></div>';
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

      case wallNodeSelect:
        gridcell.innerHTML = wallNodeMouseOver;
        break;

      case weightNodeSelect:
        gridcell.innerHTML = weightNodeMouseOver;
        break;
    };
  };

  grid.addEventListener('mouseover', (e) => {
    console.log(gridCells);
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

  grid.addEventListener('click', (e) => {
    placeNodeInGridCell(e, hiddenField.value);
  });

  const placeNodeInGridCell = (e, hiddenfieldValue) => {
    gridCells.forEach((gridcell) => {
    // compare the innerhtml of the cell to the hidden field value

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
// ADD WALLS
});
