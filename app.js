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
    // MIGHT only need i for dijkstra's algorithm to identify visited and unvisited nodes.
    // distances.
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
      };

      // adding a different node to a new gridcell
      if ((e.target == gridcell || e.target == gridcell.firstElementChild) && gridcell.innerHTML != hiddenfieldValue) {
        gridcell.innerHTML = hiddenField.value;
      };

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
      // console.log(' ');
      // console.log(currentCell);
      // console.log(neighbours[z]);
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

   tracker[neighbour.outerHTML] = currentCell.outerHTML; // change to get attribute i

  }

  findNeighbours = (currentX, currentY, ySubtrahend, xSubtrahend) => {
    let neighbour = gridCells.find(cell => parseInt(getCoord(cell, 'y')) == currentY - ySubtrahend
    && parseInt(getCoord(cell, 'x')) == currentX - xSubtrahend);
    return neighbour;
  };

  // function to calculate shortest path once target found
  let path = [];
  calculatePath = (tracker, target) => {
    let rotations = 0;

    // scenarios:
    // if target x > start x, we know target is right of start
    // if target x < start x, target is left of start
    // if target y is > than start y, target is below start
    // if target y is < than start

    // otherwise starting with the target find the previous cell. repeat this recursively. add them to an array in order then add the animations
    // to highlight the path.
    let previousCell = target;

    console.log(tracker[previousCell]);
    if (tracker[previousCell].includes("start")){
      // path.unshift(previousCell);
      console.log(path);
      showPath(path);
      return;
    }
    else{
      path.unshift(previousCell);
      calculatePath(tracker, tracker[previousCell]);
    };

  };


  showPath = (pathArray) => {
    console.log(pathArray.length);
    pathArray.forEach(div => {
      console.log(div);
    });
  };




  // Maybe in 'visited' I could store the div that was used to discover the div we are currently visiting.
  // Why?
  // This problem comes from implementing the algorithm within the confines of the language and the DOM.
  // The algorithm requires that in order to know the shortest path from the start to any given node/cell,
  // we must know which node/cell came before the given one. And that the path up to the one before it, is definitely the shortest path
  // to the one before it.
  // So if we want to know the shortest path from A -> C, we may find that this is actually via B (A -> B -> C) even though there is a direct
  // path from A -> C. For this to be true, A -> B must be the shortest path from A -> B.
  // In the visualiser, because it is a 2D grid, on every iteration where we visit a new node from the current one we are inspecting,
  // we know that the shortest path to that new node is via the one we are inspecting. Any alternative route would be >= to this path.
  // At the point when the target is found, we know the cell that is a neighbour to it and whose inspection discovers it, is the final node
  // in the shortest path to the target.
  // We can then conceptually execute this idea recursively; we know that the neighbour of the cell whose inspection discovered the cell that is
  // a neighbour of the target (and discovered and discovered the target) is the final node in the path to that neighbour.
  // We can repeat these steps recursively until we get back to the start...and then we just have to count the number of nodes we went through
  // and we have the shortest path.
  // The problem arises when trying to store this information in JS from the DOM.
  // The only appropriate data structure that immediately comes to mind is an object. Why?
  // Because of the way the algorithm implementation works.
  // On the first iteration of the algo, we start with the start node and we must examine the nodes closest to the start i.e. one step away.
  // In the grid, these are the nodes above, right, below and left of the start node.
  // We can then consider the start node as 'visited' since we have examined all the nodes we can travel to from it.
  // If none of those contain the target, we then perform the same idea on the nodes we just examined, we 'visit' them. So, for the node
  // above the start node, we examine the node above it, to its' right, below it and left of it.
  // We do this for the node to the right of the start node and the ones below and to the left of it too.
  // Of course, there is some overlap here. For example, when we examine the node above the start, and look at the nodes above, right, below
  // and left of it - we of course already know that the node below it is the start node, which we have already visited, so we don't
  // need to examine it and we can skip over it. This is captured in the code with a continue statement.
  // We repeat this process until we find the target. With each iteration, we are demonstrating the 'visit the node with the closest known
  // distance from the start and examine its' neighbours' step of the algo. This is also why it is diamond shaped.
  // Back to the problem - capturing the data of which node was used to discover the shortest path to the node we are currently visiting.
  // Based on the implementation of how we visit a node i.e. we examine its' neighbours above, right, below and left, we know that any
  // all of the valid neighbours were visited by the cell we are currently examining.
  // Given this, we can store the neighbours as the keys of an object and the value as the cell we are currently visiting.
  // This way, all the keys are unique since they are all different cells, but the the values are not. Two cells represented
  // as keys may have the same value i.e. they may have been discovered by the same cell because they could be the above and left neighbours
  // of that cell, for example.
  // The problem is object keys can only be stored as strings, meaning when the div representing a neighbour of the cell we are visiting
  // is stored as a key, it is converted to a string as [object HTMLDivElement] first and JS therefore fails to recognise it a uniquely new key.
  // So the object only ends up with one key that is constantly overwritten.
  // We can overcome this problem by storing the outerHTML of the div neighbours as keys. And then the recursive function of tracing the path backwards
  // works. But it means we then have to search for the cells in the DOM again since we lost reference to them. So perhaps there is a better way.
  // Maybe I could use document.replaceChild....
