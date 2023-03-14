// CREATING THE GRID
  const grid = document.getElementById('grid');
  // const rowNodes = document.getElementsByClassName('row-node');

  const gridCellsNo = 1200;
  let i = 0;

  for(i=0; i < gridCellsNo; i++){
    grid.innerHTML += `<div class='node' ${i}></div>` // this grid is 20 rows x 60 cols = 1200 squares
  }


// USER SELECTING A NODE FROM THE KEY
  const keyForNodes = document.querySelector('#main .key');
  const userNodeDivs = Array.from(document.querySelectorAll('#main .key .user-slct'));
  const hiddenField = document.getElementById('hiddenField');

  // To populate hidden field when user clicks on which node they want to place in the grid
  keyForNodes.addEventListener('click', e => {
    let i = 0;
    for (i = 0; i < userNodeDivs.length; i++){
      iconsAndText = Array.from(userNodeDivs[i].children)
      if (userNodeDivs[i] == e.target || iconsAndText.includes(e.target)) {
        hiddenField.value = userNodeDivs[i].lastElementChild.innerText;
      }
    }
  });

  //


// ADDING HOVER EFFECT IN GRID FOR SELECTED NODE
  const gridCells = Array.from(document.getElementsByClassName("node"));
  const startNodeMouseOver = '<img src="icons/right-arrow.png" class="grid-icons">';
  const targetNodeMouseOver = '<img src="icons/target.png" class="icons-sizing" id="icon-target">';
  const weightNodeMouseOver = '<img src="icons/weight.png" class="icons-sizing" id="icon-weight">';
  const bombNodeMouseOver = '<img src="icons/bomb.png" class="icons-sizing" id="icon-bomb">';
  const wallNodeMouseOver = '<div class="node-icons" id="wall-node"></div>';

  const selectedStartNodeCell = '<img src="icons/right-arrow.png" id="startCell">';

  grid.addEventListener('mouseover', e => {
    gridCells.forEach((gridcell) => {

      if (e.target == gridcell.firstElementChild){
        return;
      }

      if (gridcell.innerHTML == "" && e.target == gridcell) {
        switch (hiddenField.value) {
          case 'Start Node':
            gridcell.innerHTML = startNodeMouseOver;
            break;
          case 'Target Node':
            gridcell.innerHTML = targetNodeMouseOver;
            break;

          case 'Bomb Node':
            gridcell.innerHTML = bombNodeMouseOver;
            break;

          case 'Wall Node':
            gridcell.innerHTML = wallNodeMouseOver;
            break;

          case 'Weight Node':
            gridcell.innerHTML = weightNodeMouseOver;
            break;

          default:
             break;
        }
      };

      if (gridcell.innerHTML != "" && gridcell != e.target) {
        gridcell.innerHTML = "";
      };

    });
  });
