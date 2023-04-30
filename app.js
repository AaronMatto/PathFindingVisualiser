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
    grid.innerHTML += `<div class='node' data-x=${x} data-y=${y} data-i=${i}></div>`
    x++;
    // turns out, I MIGHT only need i for dijkstra's algorithm to identify visited and unvisited nodes. x and y could be useful for calculating
    // distances however, so leaving in for now.
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

  dijkstra = (startcell) => {

    // implementing the algorithm
    let visited = [];
    let unvisited = [startcell];
    // visited.includes(targetNodeSelect) == false)
    let breakpoint = 0;

// on iteration 1 we know:
// currentlyVisitedCellWorks, so it grabs the reference from unvisited fine, meaning unvisited works
// currentlyVisitedNewNeighbours recognises the right cells but does not grab a proper reference to them, HTMLObject

    while (visited.includes(targetNodeSelect) == false){
      console.log(``);
      let numberToVisit = unvisited.length;
      console.log(`numberToVisit on iteration ${breakpoint} is ${numberToVisit}`);
      for(let i = 0; i < numberToVisit; i++){
        currentlyVisitedCell = unvisited[i];
        console.log(`currently visiting ${currentlyVisitedCell + ' ' + i}`);
        console.log(currentlyVisitedCell);

        currentlyVisitedNewNeighbours = findUnvisitedNeighbours(currentlyVisitedCell);
        console.log(`next iterations nodes to visit: ${currentlyVisitedNewNeighbours}`)

        visited.push(currentlyVisitedCell);
        console.log(visited);

        unvisited = unvisited.concat(currentlyVisitedNewNeighbours);
      };

      unvisited.splice(0, numberToVisit);
      console.log(`unvisited with new neighbours only:`);
      console.log(unvisited.length);
      breakpoint++;
    };

  };

  const visualiseBtn = document.getElementById("visualise-btn");
  visualiseBtn.parentElement.addEventListener('click', e => {

    if (e.target == visualiseBtn.parentElement){
      gridCells.forEach((gridcell) => {
        if(gridcell.innerHTML == startNodeSelect) {
          dijkstra(gridcell);
        };
      });
    };
  });


  // function to find unvisited neighbours
  findUnvisitedNeighbours = (currentCell) => {
    let yCoord = currentCell.getAttribute("data-y");
    let xCoord = currentCell.getAttribute("data-x");

    let y = parseInt(yCoord, 10);
    let x = parseInt(xCoord, 10);

    let aboveNeighbour = findNeighbours(x, y, 1, 0);
    let rightNeighbour = findNeighbours(x, y, 0, -1);
    let belowNeighbour = findNeighbours(x, y, -1, 0);
    let leftNeighbour = findNeighbours (x, y, 0, 1);
    let neighbours = [aboveNeighbour, rightNeighbour, belowNeighbour, leftNeighbour];
    let unvisitedNeighbours = [];

    neighbours.forEach((neighbour) => {

      // if neighbour is the target call calculate path function
      console.log(neighbour);
      if (neighbour == undefined){

      }

      if (neighbour.classList.contains("visited-node-1") || neighbour.innerHTML != ""){
        console.log('na');
        return
      } else {
        console.log('ye');
        neighbour.classList.add("visited-node-1");
        unvisitedNeighbours.push(neighbour);
      };
    });

    return unvisitedNeighbours;
  };

  findNeighbours = (currentX, currentY, ySubtrahend, xSubtrahend) => {
    let neighbour = gridCells.find(cell => parseInt(cell.getAttribute("data-y")) == currentY - ySubtrahend
    && parseInt(cell.getAttribute("data-x")) == currentX - xSubtrahend);
    return neighbour;
  };
