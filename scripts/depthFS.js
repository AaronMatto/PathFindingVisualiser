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
let isBombStart;
let bombExists;
let recursiveCount;

const getCoord = (cell, z) => {
  const coord = cell.getAttribute(`data-${z}`);
  return parseInt(coord);
};


export const depthFirstSearch = async (startcell, startingDirection, isBomb, bombStart) => {
  bombExists = isBomb;
  isBombStart = bombStart;
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
        depthFirstSearch(newStart, bombStartDirection, bombExists, true);
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

      if (unvisited.every((element) => element == undefined)) return; // to stop infinite loops if there is no path from start to target.

    };
  };
  calculatePath(tracker, target);
  showPath(path);
};


const findUndiscoveredNeighbours = async (currentCell) => {
  const y = getCoord(currentCell, 'y');
  const x = getCoord(currentCell, 'x');
  const neighbours = [];
  const rightNeighbour = findNeighbour(x, y, 0, -1);
  const aboveNeighbour = findNeighbour(x, y, 1, 0);
  const belowNeighbour = findNeighbour(x, y, -1, 0);
  const leftNeighbour = findNeighbour(x, y, 0, 1);
  neighbours.push(aboveNeighbour, rightNeighbour, belowNeighbour, leftNeighbour);
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

      if (neighbours[z].classList.contains('discovered-node-2') ||
        neighbours[z].classList.contains('visited-node-2')) {
        continue;
      };

      if (neighbours[z].classList.contains('visited-node-1') ||
        neighbours[z].classList.contains('discovered-node')) {
        neighbours[z].classList.remove('visited-node-1');
        neighbours[z].classList.remove('discovered-node');
      };
    };

    if (neighbours[z].id.includes('start') ||
      neighbours[z].classList.contains('discovered-node')) {
      continue;
    };

    if (neighbours[z].classList.contains('visited-node-1')) {
      continue;
    };

    neighbours[z].dataset.direction = z + 1; // sets our dynamic number-direction system
    updateTracker(currentCell, neighbours[z]);

    if (neighbours[z].innerHTML == bombNodeSelect) {
      neighbours[z].id += ' bomb';
      updateTracker(currentCell, neighbours[z]);
      return neighbours[z].id;
    }

    if (neighbours[z].innerHTML == targetNodeSelect && bombExists == false) {
      // neighbours[z].classList.add('shortest-path-node');
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

const updateTracker = (currentCell, neighbour) => {
  tracker[neighbour.id] = currentCell.id;
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
    pathDiv.classList.remove('visited-node-2');

    if (specificIndex !== 0 && j >= specificIndex) {
      pathDiv.classList.remove('shortest-path-node');
      pathDiv.classList.add('shortest-path-node-2');
    } else {
      pathDiv.classList.add('shortest-path-node');
    }

    await addDelay('medium');
  };
};
