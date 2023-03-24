// CREATING THE GRID AND COORDINATE SYSTEM FOR EACH CELL
  const grid = document.getElementById('grid');
  // const rowNodes = document.getElementsByClassName('row-node');

  const gridCellsNo = 1200;
  let i = 0;
  let y = 0;
  for(i=0; i < gridCellsNo; i++){
    let x = i % 60;
    if (x == 0 && i != 0){
      y++;
    }
    grid.innerHTML += `<div class='node' data-x='${x}' data-y='${y}' ${i}></div>`
    x++;
  };

// CLEAR BOARD
  const gridCells = Array.from(document.getElementsByClassName("node"));
  const clearBoardBtn = document.getElementById('clearBoardBtn');
  clearBoardBtn.addEventListener('click', e => {
    if (e.target == clearBoardBtn){
      gridCells.forEach(gridcell => {
        gridcell.innerHTML = "";
      });
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


  keyForNodes.addEventListener('click', e => {
    let i = 0;
    for (i = 0; i < userNodeDivs.length; i++){
      iconsAndText = Array.from(userNodeDivs[i].children)
      if (userNodeDivs[i] == e.target || iconsAndText.includes(e.target)) {
        switch(userNodeDivs[i].lastElementChild.innerText){
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
        }
      }
    }
  });

// ADDING HOVER EFFECT IN GRID FOR SELECTED NODE
  const startNodeSelect = '<img src="icons/right-arrow.png" class="selectedCell">';
  const targetNodeSelect = '<img src="icons/target.png" class="selectedCell" id="icon-target">';
  const weightNodeSelect = '<img src="icons/weight.png" class="selectedCell" id="icon-weight">';
  const bombNodeSelect = '<img src="icons/bomb.png" class="selectedCell" id="icon-bomb">';
  const wallNodeSelect = '<div class="selectedCell" id="wall-node"></div>';
  const nodeArray = [startNodeMouseOver, targetNodeMouseOver, weightNodeMouseOver, bombNodeMouseOver, wallNodeMouseOver];

  // function to add inner html to the grid cell is used for hover and for click
  function hiddenFieldValue(gridcell){
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
    }
  }

  grid.addEventListener('mouseover', e => {
    gridCells.forEach((gridcell) => {

      if (e.target == gridcell.firstElementChild){
        return;
      }

      if (gridcell.innerHTML == "" && e.target == gridcell) {
        hiddenFieldValue(gridcell);
      };

      if (nodeArray.includes(gridcell.innerHTML) && gridcell != e.target) {
        gridcell.innerHTML = "";
      };

    });
  });

// ADDING SELECTED ICON INTO A GRID CELL

  grid.addEventListener('click', e => {
    placeNodeInGridCell(e, hiddenField.value);
  });

  placeNodeInGridCell = (e, hiddenfieldValue) => {
    gridCells.forEach(gridcell => {
    // I need to compare the innerhtml of the cell to the hidden field value

      // removing a placed node from a gridcell
      if ((e.target != gridcell.firstElementChild) && gridcell.innerHTML == hiddenfieldValue) {
        gridcell.innerHTML = "";
      }

      // adding a different node to a new gridcell
      if ((e.target == gridcell || e.target == gridcell.firstElementChild) && gridcell.innerHTML != hiddenfieldValue) {
        gridcell.innerHTML = hiddenField.value;
      }

    });
  }

// PLOTTING THE SHORTEST PATH - here we go...

  // first, identify the cell with a start node and cell with a target node
  // grab the x and y coordinates of each
  // find the difference between each coordinate (x and y) from start node to end node. Do start - end.
  // store the difference for each
  // if the difference is say (-10, 15) that means we need to go 10 cells left (-ve is )
  // as the target has a smaller x, and 15 cells up (+ve is up for y and -ve is down(but up on the scale))
  // the difference for each coord is the shortest path. Sign matters as tells us to go left/right or up/down.
  // fill in the number of cells equal to the y diff above/below the start with shortest path node
  // fill in the number of cells equal to the x diff left/right of the start with the shortest path node
