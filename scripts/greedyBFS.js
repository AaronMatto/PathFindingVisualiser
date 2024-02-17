/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable padded-blocks */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
// REFACTOR needed
import { gridCells, targetNodeSelect, bombNodeSelect, addDelay, path } from './app.js';

const speedSelection = document.getElementById('speed-button');
let tracker;
let target;
let targetX;
let targetY;
let isBombStart;
let bombExists;
let recursiveCount;

const getTargetCoords = () => {
  gridCells.forEach((gridcell) => {
    if (gridcell.innerHTML == targetNodeSelect && bombExists == false) {
      target = gridcell;
    };

    if (gridcell.innerHTML == bombNodeSelect && bombExists == true) {
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


export const greedyBFS = async (startcell, startingDirection, isBomb, bombStart) => {
  bombExists = isBomb;
  isBombStart = bombStart;
  getTargetCoords();
  const visited = [];
  let unvisited = [startcell];
  let targetReached = false;
  tracker = {};
  let currentlyVisitedNewNeighbours;
  startcell.dataset.direction = startingDirection;
  startcell.dataset.path = '0';
  startcell.dataset.astar = '0';
  recursiveCount = 0;

  while (targetReached == false) {

    const numberToVisit = unvisited.length;
    sortUnvisitedBySum(unvisited);

    for (let i = 0; i < numberToVisit; i++) {
      const currentlyVisitedNode = unvisited[i];
      if (unvisited[i] == undefined) continue;

      if (isBombStart == false) {
        currentlyVisitedNode.classList.remove('discovered-node');
        currentlyVisitedNode.classList.add('visited-node-1');
      } else {
        currentlyVisitedNode.classList.remove('discovered-node-2');
        currentlyVisitedNode.classList.add('visited-node-2');
      };

      currentlyVisitedNewNeighbours = await findUndiscoveredNeighbours(currentlyVisitedNode);

      if (Array.isArray(currentlyVisitedNewNeighbours) == false && bombExists == true) {
        bombExists = false;
        target = currentlyVisitedNewNeighbours;
        const newStart = document.getElementById(currentlyVisitedNewNeighbours);
        const bombStartDirection = newStart.dataset.direction;
        calculatePath(tracker, newStart.id);
        greedyBFS(newStart, bombStartDirection, bombExists, true);
        return;
      };

      if (Array.isArray(currentlyVisitedNewNeighbours) == false && bombExists == false) {
        targetReached = true;
        target = currentlyVisitedNewNeighbours;
        break;
      };

      visited.push(currentlyVisitedNode);

      if (unvisited[i].classList.contains('visited-node-1') ||
        currentlyVisitedNode.id.includes('start') ||
        unvisited[i].classList.contains('visited-node-2')) {
        delete unvisited[i];
      };

      unvisited = currentlyVisitedNewNeighbours.concat(unvisited);

      if (currentlyVisitedNewNeighbours.length !== 0) {
        break;
      };
    };
  };
  calculatePath(tracker, target);
  showPath(path);
};


const sortUnvisitedBySum = (unsortedDiscoveredNodeArray) => {
  unsortedDiscoveredNodeArray.sort((a, b) => {
    const aStarDiff = parseInt(a.dataset.astar) - parseInt(b.dataset.astar);

    if (aStarDiff == 0) {
      // If astar and path values are the same, prioritize the node added first. Not working.
      return unsortedDiscoveredNodeArray.indexOf(b) - unsortedDiscoveredNodeArray.indexOf(a);
    };

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
      neighbours[z].classList.contains('wall-node')) {
      continue;
    };

    if (isBombStart == true) {

      if (neighbours[z].id.includes('start')) {
        neighbours[z].id = neighbours[z].id.replace(' start', '');
      };

      if (neighbours[z].classList.contains('discovered-node-2')) {
        continue;
      };

      if (neighbours[z].classList.contains('visited-node-1') ||
        neighbours[z].classList.contains('discovered-node')) {
        neighbours[z].classList.remove('visited-node-1');
        neighbours[z].classList.remove('discovered-node');
      };

      if (neighbours[z].classList.contains('visited-node-2')) {
        continue;
      };
    };

    if (neighbours[z].id.includes('start')) {
      continue;
    };

    if (neighbours[z].classList.contains('visited-node-1')) {
      continue;
    };

    if (neighbours[z].classList.contains('discovered-node')) {
      continue;
    } else {
      neighbours[z].dataset.direction = z + 1; // sets our dynamic number-direction system
      updateTracker(currentCell, neighbours[z]);
      rotationCost(currentCell, neighbours[z]);
    };

    setAStarSumDistance(neighbours[z]);

    if (neighbours[z].classList.contains('weight-node')) {
      neighbours[z].dataset.astar += parseInt(neighbours[z].dataset.astar) + 10;
    };

    if (neighbours[z].innerHTML == bombNodeSelect) {
      neighbours[z].id += ' bomb';
      updateTracker(currentCell, neighbours[z]);
      return neighbours[z].id;
    }

    if (neighbours[z].innerHTML == targetNodeSelect && bombExists == false) {
      neighbours[z].classList.add('shortest-path-node');
      updateTracker(currentCell, neighbours[z]);
      return neighbours[z].id;
    };

    neighbours[z].classList.add('visiting-node');
    await addDelay(speedSelection.value);
    neighbours[z].classList.remove('visiting-node');
    isBombStart == false ? neighbours[z].classList.add('discovered-node') : neighbours[z].classList.add('discovered-node-2');
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
  neighbour.dataset.astar = manhattan;
};


const updateTracker = (currentCell, neighbour) => {
  tracker[neighbour.id] = currentCell.id;
};


const shortestPathToCurrentNode = (currentNode) => {
  const shortestPathToCurrentCell = currentNode.dataset.path;
  return parseInt(shortestPathToCurrentCell);
};


let specificIndex;
const calculatePath = (tracker, targetId) => {
  const previousCell = targetId;

  if (isBombStart) {
    specificIndex = path.length - recursiveCount;
    recursiveCount++;
  };

  if (tracker[previousCell].includes('start') || tracker[previousCell].includes('bomb')) {
    isBombStart ? path.splice(specificIndex, 0, previousCell) : path.unshift(previousCell);
    return;
  } else {
    isBombStart ? path.splice(specificIndex, 0, previousCell) : path.unshift(previousCell);
    calculatePath(tracker, tracker[previousCell]);
  };
};

const showPath = async (pathIdArray) => {
  for (let j = 0; j < pathIdArray.length; j++) {
    const pathDiv = document.getElementById(pathIdArray[j]);
    pathDiv.classList.remove('visited-node-1');
    pathDiv.classList.add('shortest-path-node');
    await addDelay('medium');
  };
};
