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
        gridcell.className = "";
        gridcell.classList.add('node');
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
    // compare the innerhtml of the cell to the hidden field value

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

// PLOTTING THE SHORTEST PATH
  let running;


  getCoord = (cell, z) => {
    return cell.getAttribute(`data-${z}`);
  }

  dijkstra = (startcell) => {
    let visited = [];
    let unvisited = [startcell];
    let iterations = 0;
    let target;
    running = true;

    while (running == true){
      console.log(``);
      let numberToVisit = unvisited.length;

      for(let i = 0; i < numberToVisit; i++){
        let currentlyVisitedCell = unvisited[i];

        let currentlyVisitedNewNeighbours = findUnvisitedNeighbours(currentlyVisitedCell);
        if (Array.isArray(currentlyVisitedNewNeighbours) == false){
          console.log(iterations);
          i = numberToVisit;
          target = currentlyVisitedNewNeighbours; // so that we don't perform this code > once, since the target can be the neigbour of more than one cell in the unvisited[] we are iterating over.
        }

        visited.push(currentlyVisitedCell);

        unvisited = unvisited.concat(currentlyVisitedNewNeighbours);
      };

      unvisited.splice(0, numberToVisit);
      iterations++;
    };

    calculatePath(tracker, target);
  };

  const visualiseBtn = document.getElementById("visualise-btn");
  visualiseBtn.parentElement.addEventListener('click', e => {
    let startCell;
    let targetCell;
    if (e.target == visualiseBtn.parentElement){
      gridCells.forEach((gridcell) => {

        if(gridcell.innerHTML == targetNodeSelect){
          targetCell = gridcell;
        }

        if(gridcell.innerHTML == startNodeSelect) {
          gridcell.classList.add('start');
          startCell = gridcell;
        };
      });

      if (startCell == undefined || targetCell == undefined){ // May change later. Can we do this without knowing where the target is?
        alert('Please select both a start and end point');
        return;
      };

      dijkstra(startCell);

    };
  });


  let tracker = new Object();
  // function to find unvisited neighbours
  findUnvisitedNeighbours = (currentCell) => {
    let yCoord = getCoord(currentCell, 'y');
    let xCoord = getCoord(currentCell, 'x');

    let y = parseInt(yCoord);
    let x = parseInt(xCoord);

    let aboveNeighbour = findNeighbours(x, y, 1, 0);
    let rightNeighbour = findNeighbours(x, y, 0, -1);
    let belowNeighbour = findNeighbours(x, y, -1, 0);
    let leftNeighbour = findNeighbours (x, y, 0, 1);
    let neighbours = [aboveNeighbour, rightNeighbour, belowNeighbour, leftNeighbour];
    let unvisitedNeighbours = [];

    for(let z = 0; z < neighbours.length; z++){

      // if neighbour is the target call calculate path function
      if(neighbours[z] == undefined){
        continue;
      }

      if (neighbours[z].innerHTML == targetNodeSelect) {
        neighbours[z].classList.add("visited-node-1");
        running = false;
        updateTracker(currentCell, neighbours[z]);
        console.log(tracker);
        return neighbours[z].outerHTML;
      }

      if (neighbours[z].classList.contains("visited-node-1") ||
        neighbours[z].innerHTML === startNodeSelect){
        continue;
      }



      neighbours[z].classList.add("visited-node-1");
      updateTracker(currentCell, neighbours[z]);
      unvisitedNeighbours.push(neighbours[z]);
    };

    return unvisitedNeighbours;
  };

  updateTracker = (currentCell, neighbour) => {

   tracker[neighbour.outerHTML] = currentCell.outerHTML;

  }

  findNeighbours = (currentX, currentY, ySubtrahend, xSubtrahend) => {
    let neighbour = gridCells.find(cell => parseInt(getCoord(cell, 'y')) == currentY - ySubtrahend
    && parseInt(getCoord(cell, 'x')) == currentX - xSubtrahend);
    return neighbour;
  };

  // function to calculate shortest path once target found
  calculatePath = (tracker, target) => {
    let rotations = 0;
    let path = [];
    // scenarios:
    // if target x > start x, we know target is right of start
    // if target x < start x, target is left of start
    // if target y is > than start y, target is below start
    // if target y is < than start

    // base condition: if gridcell innerhtml is startselect then stop

    // otherwise starting with the target find the previous cell. repeat this recursively. add them to an array in order then add the animations
    // to highlight the path.
    let previousCell = target;

    console.log(tracker[previousCell]);
    if (tracker[previousCell].includes("start")){
      console.log('f');
      path.push(previousCell);
      console.log(path);
      return;
    }
    else{
      path.push(previousCell);
      calculatePath(tracker, tracker[previousCell]);
    };
    //if (tracker[previousCell])


  };



  // i need:
  // the previous node to the one we've just discovered (not visited) since we KNOW that the shortest path to this one is the one we are currently
  // visiting.
  // i also need the previous node we visited to the one we are currently visitng, as this is the last step in the shortest path to the one
  // we are currently visiting.
  // and the same for the node before the one we are visiting....this is recursive.
  // the number of steps to the target is the number of iterations + 1. perhaps put iterations as inner text of a node.
