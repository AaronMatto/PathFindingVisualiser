const grid = document.getElementById('grid');
// const rowNodes = document.getElementsByClassName('row-node');

const gridCellsNo = 1200;
let i = 0;

for(i=0; i < gridCellsNo; i++){
  grid.innerHTML += `<div class='node' ${i}></div>` // this grid is 20 rows x 60 cols = 1200 squares
}

const gridCells = Array.from(document.getElementsByClassName("node"));
const startNodeMouseOver = '<img src="icons/right-arrow.png" class="grid-icons">';
const selectedStartNodeCell = '<img src="icons/right-arrow.png" id="startCell">';

grid.addEventListener('mouseover', e => {

  gridCells.forEach((gridcell, index, grid) => {

    if (e.target == gridcell.firstElementChild){
      return;
    }

    if (gridcell.innerHTML == "" && e.target == gridcell) {
      gridcell.innerHTML = startNodeMouseOver;
    };

    if (gridcell.innerHTML == startNodeMouseOver && (gridcell != e.target)) {
      gridcell.innerHTML = "";
    };

  });
});


// adding the start node and target node
grid.addEventListener('click', e => {
 //console.log(e);

  // start node
  gridCells.forEach((gridcell, index, grid) => {
    // if (e.target == gridcell || e.target == gridcell.firstElementChild) {
    //   gridcell.innerHTML = selectedStartNodeCell;
    //   console.log(gridcell);
    // }


    // if (gridcell.innerHTML == startNodeMouseOver && (e.target == gridcell.firstElementChild || e.target == gridcell)) {
    //   gridcell.innerHTML = selectedStartNodeCell;
    //   console.log(e.target);
    // };

    // if (gridcell.innerHTML == selectedStartNodeCell && (e.target != gridcell.firstElementChild || e.target != gridcell)) {
    //   console.log(gridcell.firstElementChild);
    //   console.log(e.target);
    //   gridcell.innerHTML = "";
    //   console.log(e.target); // THE TARGET IS STARTNODEMOUSEOVER
    // };
    // IF WE HAVE OUR IF STATEMENTS THIS WAY AROUND THEN e.Target BECOMES unreferenceable via any other element in the DOM because it gets removed in the first if statement
    // when we set the innerHTML of the div to startNodeMouseOver. Therefore, the && () bracket part of the second if statement will always be true since
    // e.target is the actual <img src="icons/right-arrow.png" class="grid-icons"> in the DOM. This is not equivalent to the firstElementChild of the gridcell
    // nor the gridcell itself, hence the whole statement evaluates to true for the cell we just clicked on. The cell we just clicked on therefore runs
    // this second if statement and has its HTML set to "", so we never see the start node placed in it. There is no if condition we can write here to say
    // if the target is equal to <img src="icons/right-arrow.png" class="grid-icons"> since we cannot reference it from any element in the DOM anymore.


    // in this case, we first check for every gridcell whether it has '<img src="icons/right-arrow.png" id="startCell">' as innerHTML and whether
    // the target of the click, e.target, was that gridcell. We don't need to check if e.target != gridcell.firsElementChild because this will always be true,
    // as e.target is always startNodeMouseOver (but is sometimes gridcell due to hitbox of startNodeMouseOver) because of the mouse event.
    // By checking this first, we still run into the problem above where the conditions concerning e.target for a cell whose innerHTML
    // is selectedStartNoderemoving are always true...
    // BUT, because it is run BEFORE the if statement that places the start node in a cell, it doesn't remove the start node
    // in the cell it was JUST placed in, only in the one that had the startNode in it.
    // Of course, when the user clicks in the grid for the very first time no gridcell has innerHTML of selectedStartNodeCell so this first if statement
    // does not run.
    // If a user clicks on a cell to add the start node then clicks the same cell, it still works. Because the target will not be the cell,
    // (unless they click the very bottom of the cell in which case it doesn't work and nothing happens) it will be the startNodeMouseOver
    // that cells' innerHTML will also be selectedStartNodeCell, and the code to remove the start node from the cell and set its' innerHTML to ""
    // will run. Second if statement wont run since innerHTML == "".

    if (gridcell.innerHTML == selectedStartNodeCell && (e.target != gridcell || e.target == gridcell)) {
      console.log(gridcell);
      console.log(e.target);
      gridcell.innerHTML = "";
    };

    if (gridcell.innerHTML == startNodeMouseOver && (e.target == gridcell.firstElementChild || e.target == gridcell)) {
      gridcell.innerHTML = selectedStartNodeCell;
    };
  });

  // Target Node
  //if (grid.innerHTML)

});
