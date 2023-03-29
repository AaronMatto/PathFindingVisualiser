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

    // parsing out the x, y and i coords of each cell for reference
    let y = startcell.getAttribute("data-y");
    let x = startcell.getAttribute("data-x");
    let i = startcell.getAttribute("data-i");

    let yCoord = parseInt(y, 10);
    let xCoord = parseInt(x, 10);
    let iCoord = parseInt(i, 10);

    // implementing the algorithm
    let visited = [];
    let unvisited = [...gridCells]; // rather than removing the start node from this array, we can set the loop to run until it has a length of 1 ?
    // while (unvisited.length != 1){ // No. We don't want to visit the entire grid. We want to loop until we find the target. Fix later, works for now.

      // 1. Visit the vertex with the smallest known distance from the start vertex
      // this is going to be the nodes directly above, below, right and left of the start cell
      // Referencing the nodes right and left is easy via iCoord (not using x since other cells have same x which is not useful for
      // uniquely identifying visited/unvisited). Up and down is done via y-coord and we can use this dynamically to grab the iCoord for
      // those cells possibly. Right and left first
      rightCell = unvisited[unvisited.indexOf(startcell) + 1];
      leftCell = unvisited[unvisited.indexOf(startcell) - 1];

      console.log(rightCell);
      console.log(leftCell);
      console.log(typeof x);
      console.log(xCoord);


    //};

  };


  const visualiseBtn = document.getElementById("visualise-btn");
  visualiseBtn.parentElement.addEventListener('click', e => {

    if (e.target == visualiseBtn.parentElement){
      gridCells.forEach(gridcell => {
        if(gridcell.innerHTML == startNodeSelect) {
          dijkstra(gridcell);
        };
      });
    };
  });



  // we must start from the start node. cannot foreach the grid.
  // dijkstra says:
  // visit the closest unvisited. so we go one sq up.
  // distance travelled, one:
  // then one sq right, then one down, then one left
  // distance: two
  // then one up one right, one right one right, one down one right, one left one right
  // then two up, two right, two down, two left

  // then two up, one right etc

  // basically, you need to go in a straight line to the max distance of the iteration
  // then you need to cover all the combos of steps that go some of the max distance vertical
  // and some of the max distance RIGHT
  // so say we are on the iteration of travelling 4 steps, we need to go:
  // 4 up
  // 3 up 1 right
  // 2 up 2 right
  // 1 up 3 right

  // then we go 4 right and repeat for that vertical line.
