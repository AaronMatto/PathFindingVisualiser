/* eslint-disable max-len */
import {gridCells, addDelay, path} from './app.js';

let pathFromStart;
let tracker;
const speedSelection = document.getElementById('speed-button');

const getCoord = (cell, z) => {
  const coord = cell.getAttribute(`data-${z}`);
  return parseInt(coord);
};

export const bidirectionalBFS = async (startNode, goalNode) => {
  let pathFound = false;
  let unvisited = [startNode, goalNode];
  let connectingIdToStart;
  let connectingIdToGoal;
  pathFromStart = true;
  tracker = {};

  while (pathFound == false) {
    for (let i = 0; i < unvisited.length; i++) {
      if (unvisited[i] == undefined) continue;
      const currentlyVisitedNode = unvisited[i];

      const discovered = await findUndiscoveredNeighbours(currentlyVisitedNode);

      delete unvisited[i] in unvisited;

      unvisited = unvisited.concat(discovered);

      if (Array.isArray(discovered) == false) {
        connectingIdToStart = discovered.substring(0, discovered.indexOf(' '));
        connectingIdToGoal = discovered.substring(discovered.indexOf(' ') + 1);
        pathFound = true;
        break;
      };

      if (unvisited.every((element) => element == undefined)) return;
    };
  };

  calculatePath(tracker, connectingIdToStart);
  pathFromStart = false;
  calculatePath(tracker, connectingIdToGoal);
  console.log(path);
  await showPath(path);
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
  let undiscoveredNeighbours;

  if (givenNode.classList.contains('discovered-node') || givenNode.id.includes('start')) {
    givenNode.classList.remove('discovered-node');
    undiscoveredNeighbours = await iterateOverNeighboursFromStart(givenNode, neighbours);
    givenNode.classList.add('visited-node-1');
  } else {
    givenNode.classList.remove('discovered-node-2');
    undiscoveredNeighbours = await iterateOverNeighboursFromGoal(givenNode, neighbours);
    givenNode.classList.add('visited-node-2');
  };

  if (givenNode.id.includes('start') || givenNode.id.includes('goal')) {
    givenNode.classList.add('shortest-path-node');
  };

  return undiscoveredNeighbours;
};

const findNeighbour = (currentX, currentY, ySubtrahend, xSubtrahend) => {
  const neighbour = gridCells.find((cell) => parseInt(getCoord(cell, 'y')) == currentY - ySubtrahend &&
    parseInt(getCoord(cell, 'x')) == currentX - xSubtrahend);
  return neighbour;
};


const iterateOverNeighboursFromStart = async (currentCell, neighbours) => {
  const undiscoveredNeighbours = [];

  for (let z = 0; z < neighbours.length; z++) {
    if (neighbours[z] == undefined ||
      neighbours[z].classList.contains('wall-node') ||
      neighbours[z].id.includes('start') ||
      neighbours[z].classList.contains('visited-node-1') ||
      neighbours[z].classList.contains('discovered-node')) {
      continue;
    };

    neighbours[z].classList.add('visiting-node');
    await addDelay(speedSelection.value);
    neighbours[z].classList.remove('visiting-node');

    if (neighbours[z].classList.contains('discovered-node-2')) {
      const ids = `${currentCell.id} ${neighbours[z].id}`;
      console.log('yes');
      return ids;
    };

    updateTracker(currentCell, neighbours[z]);

    neighbours[z].classList.add('discovered-node');

    undiscoveredNeighbours.push(neighbours[z]);
  };

  return undiscoveredNeighbours;
};


const iterateOverNeighboursFromGoal = async (currentCell, neighbours) => {
  const undiscoveredNeighbours = [];

  for (let z = 0; z < neighbours.length; z++) {
    if (neighbours[z] == undefined ||
      neighbours[z].classList.contains('wall-node') ||
      neighbours[z].id.includes('goal') ||
      neighbours[z].classList.contains('visited-node-2') ||
      neighbours[z].classList.contains('discovered-node-2')) {
      continue;
    };

    neighbours[z].classList.add('visiting-node');
    await addDelay(speedSelection.value);
    neighbours[z].classList.remove('visiting-node');

    if (neighbours[z].classList.contains('discovered-node')) {
      const ids = `${neighbours[z].id} ${currentCell.id}`;
      return ids;
    };

    updateTracker(currentCell, neighbours[z]);

    neighbours[z].classList.add('discovered-node-2');

    undiscoveredNeighbours.push(neighbours[z]);
  };

  return undiscoveredNeighbours;
};


const updateTracker = (currentCell, neighbour) => {
  tracker[neighbour.id] = currentCell.id;
};


const calculatePath = (tracker, cellId) => {
  const currentCellId = cellId;
  const previousCellId = tracker[currentCellId];

  if (previousCellId.includes('start') || previousCellId.includes('goal')) {
    pathFromStart ? path.unshift(currentCellId) : path.push(currentCellId);
    return;
  } else {
    pathFromStart ? path.unshift(currentCellId) : path.push(currentCellId);
    calculatePath(tracker, previousCellId);
  };
};


const showPath = async (pathIdArray) => {
  for (let j = 0; j < pathIdArray.length; j++) {
    const pathDiv = document.getElementById(pathIdArray[j]);
    pathDiv.classList.remove('visited-node-1');
    pathDiv.classList.remove('visited-node-2');
    pathDiv.classList.add('shortest-path-node');
    await addDelay('medium');
  };
};
