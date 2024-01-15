/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable padded-blocks */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import {gridCells, targetNodeSelect, bombNodeSelect, addDelay} from './app.js';
/*
MANHATTAN WORKS BETTER ALONG GRIDS since movement is restricted to up/down and left/right.
*/
const speedSelection = document.getElementById('speed-button');
let tracker;
let target;
let targetX;
let targetY;
const getTargetCoords = () => {

  gridCells.forEach((gridcell) => {
    if (gridcell.innerHTML == targetNodeSelect) {
      target = gridcell;
    };
  });

  targetX = getCoord(target, 'x');
  targetY = getCoord(target, 'y');
};

const getCoord = (cell, z) => {
  const coord = cell.getAttribute(`data-${z}`);
  return parseInt(coord);
};

export const aStarSearch = async (startcell, startingDirection) => {

  getTargetCoords();
  const visited = [];
  let unvisited = [startcell];
  let targetReached = false;
  tracker = {};
  let currentlyVisitedNewNeighbours;
  startcell.dataset.direction = startingDirection;
  startcell.dataset.path = '0';
  startcell.dataset.astar = '0';

  while (targetReached == false) {

    const numberToVisit = unvisited.length;
    sortUnvisitedBySum(unvisited);

    for (let i = 0; i < numberToVisit; i++) {
      const currentlyVisitedNode = unvisited[i];
      if (unvisited[i] == undefined) continue;


      if (currentlyVisitedNode.classList.contains('discovered-node')) {
        currentlyVisitedNode.classList.remove('discovered-node');
        currentlyVisitedNode.classList.add('visited-node-1');
      };

      currentlyVisitedNewNeighbours = await findUndiscoveredNeighbours(currentlyVisitedNode);
      visited.push(currentlyVisitedNode);

      if (unvisited[i].classList.contains('visited-node-1') || currentlyVisitedNode.id.includes('start')) {
        delete unvisited[i];
      };

      unvisited = currentlyVisitedNewNeighbours.concat(unvisited);

      if (currentlyVisitedNewNeighbours.length !== 0) {
        break;
      };
    };
  };
};


const sortUnvisitedBySum = (unsortedDiscoveredNodeArray) => {
  unsortedDiscoveredNodeArray.sort((a, b) => {
    const aStarDiff = parseInt(a.dataset.astar) - parseInt(b.dataset.astar);
    const pathDiff = parseInt(b.dataset.path) - parseInt(a.dataset.path);

    if (aStarDiff == 0 && pathDiff == 0) {
      // If astar and path values are the same, prioritize the one added first
      return unsortedDiscoveredNodeArray.indexOf(b) - unsortedDiscoveredNodeArray.indexOf(a);
    };

    if (aStarDiff == 0) {
      return pathDiff;
    }

    return aStarDiff;

  });
};


const findUndiscoveredNeighbours = async (currentCell) => {

  const y = getCoord(currentCell, 'y');
  const x = getCoord(currentCell, 'x');
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

const findNeighbour = (currentX, currentY, ySubtrahend, xSubtrahend) => {
  const neighbour = gridCells.find((cell) => parseInt(getCoord(cell, 'y')) == currentY - ySubtrahend &&
    parseInt(getCoord(cell, 'x')) == currentX - xSubtrahend);
  return neighbour;
};

const iterateOverNeighbours = async (currentCell, neighbours) => {

  const undiscoveredNeighbours = [];

  for (let z = 0; z < neighbours.length; z++) {

    if (neighbours[z] == undefined ||
      neighbours[z].classList.contains('visited-node-1') ||
      neighbours[z].classList.contains('wall-node') ||
      neighbours[z].id.includes('start')) {
      continue;
    };

    // if bomb

    if (neighbours[z].classList.contains('discovered-node')) {
      const test = isItShorter(currentCell, neighbours[z], z);
      undiscoveredNeighbours.push(test);
      continue;
    } else {
      neighbours[z].dataset.direction = z + 1; // handily sets our dynamic number-direction system
      updateTracker(currentCell, neighbours[z]);
      rotationCost(currentCell, neighbours[z]);
    };

    if (neighbours[z].classList.contains('weight-node')) {
      neighbours[z].dataset.path = parseInt(neighbours[z].dataset.path) + 10;
    };

    setAStarSumDistance(neighbours[z]);

    if (neighbours[z].innerHTML == targetNodeSelect && bomb == false) {
      neighbours[z].classList.add('shortest-path-node');
      updateTracker(currentCell, neighbours[z]);
      return neighbours[z].id;
    };

    neighbours[z].classList.add('visiting-node');
    await addDelay(speedSelection.value);
    neighbours[z].classList.remove('visiting-node');
    neighbours[z].classList.add('discovered-node');
    undiscoveredNeighbours.push(neighbours[z]);
  };

  return undiscoveredNeighbours;
};

const rotationCost = (currentNode, neighbour) => {
  const currentDirectionInt = parseInt(currentNode.dataset.direction);
  const neighbourInt = parseInt(neighbour.dataset.direction);
  const result = currentDirectionInt - neighbourInt < 0 ? ((currentDirectionInt - neighbourInt) * -1) : (currentDirectionInt - neighbourInt);
  switch (result) {
    case (0):
      // add 1 to number of steps (no rotation)
      neighbour.dataset.path = shortestPathToCurrentNode(currentNode, neighbour) + 1; // needs to be function
      return;
    case (1):
      // add 2 to shortest path, quarter turn
      neighbour.dataset.path = shortestPathToCurrentNode(currentNode, neighbour) + 2;
      return;
    case (3):
      // add 2 to shortest path, quarter turn
      neighbour.dataset.path = shortestPathToCurrentNode(currentNode, neighbour) + 2;
      return;
    case (2):
      // add 3 to shortest path. half turn
      neighbour.dataset.path = shortestPathToCurrentNode(currentNode, neighbour) + 3;
      return;
  };
};

const setAStarSumDistance = (neighbour) => {
  const yCoord = getCoord(neighbour, 'y');
  const xCoord = getCoord(neighbour, 'x');

  const horizontalDistance = Math.abs(targetX - xCoord);
  const verticalDistance = Math.abs(targetY - yCoord);
  const manhattan = verticalDistance + horizontalDistance;
  neighbour.dataset.astar = (manhattan + parseInt(neighbour.dataset.path));
};

const updateTracker = (currentCell, neighbour) => {
  tracker[neighbour.id] = currentCell.id;
};


const shortestPathToCurrentNode = (currentNode, neighbour) => {

  if (neighbour.classList.contains('discovered-node')) {
    console.log('FAIL');
  } else {
    const shortestPathToCurrentCell = currentNode.dataset.path;
    return parseInt(shortestPathToCurrentCell);
  };
};


const isItShorter = (currentCell, neighbour, z) => {
  const knownPathCost = parseInt(neighbour.dataset.path);
  const currentDirection = parseInt(currentCell.dataset.direction);
  const pathToCurrentCell = parseInt(currentCell.dataset.path);
  const newDirection = z + 1;
  const result = Math.abs(currentDirection - newDirection);

  let newPathCost;

  switch (result) {
    case (0):
      newPathCost = pathToCurrentCell + 1;
      break;

    case (1):
      newPathCost = pathToCurrentCell + 2;
      break;

    case (2):
      newPathCost = pathToCurrentCell + 3;
      break;

    case (3):
      newPathCost = pathToCurrentCell + 2;
      break;
  };

  if (neighbour.classList.contains('weight-node')) {
    newPathCost += 10;
  };

  if (newPathCost < knownPathCost) {
    updateTracker(currentCell, neighbour);
    neighbour.dataset.path = newPathCost;
    neighbour.dataset.direction = newDirection;
    setAStarSumDistance(neighbour);
    return neighbour;
  };
};

/*
*/
