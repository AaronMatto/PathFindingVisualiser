/* eslint-disable max-len */
const getCoord = (cell, z) => {
  const coord = cell.getAttribute(`data-${z}`);
  return parseInt(coord);
};

const bidirectionalBFS = (startNode, goalNode) => {
let pathFound = false;


  while (pathFound == false) {

    // call a function that finds the neighbours of the start node and returns them

    findNeigbours(startNode);

    // store them in an array

    // call the same function for the goalNode

    // if either function call contains the same node in their returned nodes, a path can be
    // established
    // use arrayFromFunction2.filter(x => arrayFromFunction1.includes(x));

    // if not, repeat
  };
};


const findUndiscoveredNeighbours = async (givenNode) => {
  const y = getCoord(givenNode, 'y');
  const x = getCoord(givenNode, 'x');
  const neighbours = [];
  const rightNeighbour = findNeighbour(x, y, 0, -1);
  const aboveNeighbour = findNeighbour(x, y, 1, 0);
  const belowNeighbour = findNeighbour(x, y, -1, 0);
  const leftNeighbour = findNeighbour(x, y, 0, 1);
  neighbours.push(rightNeighbour, aboveNeighbour, leftNeighbour, belowNeighbour);
  const undiscoveredNeighbours = await iterateOverNeighbours(currentCell, neighbours);

  if (currentCell.id.includes('start')) {
    currentCell.classList.add('shortest-path-node');
  };

  return undiscoveredNeighbours;
};


const iterateOverNeighbours = async (currentCell, neighbours) => {
  const undiscoveredNeighbours = [];

  for (let z = 0; z < neighbours.length; z++) {
    if (neighbours[z] == undefined ||
      neighbours[z].classList.contains('wall-node') ||
      neighbours[z].id.includes('start') ||
      neighbours[z].classList.contains('visited-node-1')) {
      continue;
    };

    updateTracker(currentCell, neighbours[z]);

    neighbours[z].classList.add('visiting-node');
    await addDelay(speedSelection.value);
    neighbours[z].classList.remove('visiting-node');
    isBombStart == false ? neighbours[z].classList.add('discovered-node') : neighbours[z].classList.add('discovered-node-2');
    undiscoveredNeighbours.push(neighbours[z]);
  };

  return undiscoveredNeighbours;
};


// need to distinguish if we are finding neighbours by searching from the goal, A,
// or by searching from the target, B. Use a bool.

// if searching from A, and any discovered neighbours contain B's discovered class
// then the path is found. Vice versa.

// use one tracker...each key entry for either the goal or the start is the discovered
// neighbours of the current iteration, so there is no chance of overlapping keys
// until the first time either the iteration from the start discovers the iteration from the
// target or vice versa. At which point, the tracker will not need to be updated anyway, as
// we can establish the path.
