/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable require-jsdoc */
import {gridCells, weightNodeSelect, targetNodeSelect, bombNodeSelect, addDelay} from './app.js';

const getCoord = (cell, z) => {
  return cell.getAttribute(`data-${z}`);
};

let iterations;
let bomb;
let bombStart;
let tracker;

const startingFromBomb = () => {
  bombStart == true ? true : false;
};

export const dijkstraAlgo = async (startcell, isBomb, isBombStart) => {
  const visited = [];
  tracker = {};
  let unvisited = [startcell];
  iterations = 0;
  bomb = isBomb;
  bombStart = isBombStart;
  startcell.dataset.direction = '1';
  startcell.dataset.path = '0';
  let target;
  let running = true;
  let currentlyVisitedNewNeighbours;
  let shouldExit = false;

  while (running == true) {
    const numberToVisit = unvisited.length;
    for (let i = 0; i < numberToVisit; i++) {
      if (unvisited[i] == undefined) continue;

      if (bombStart == false && unvisited[i].dataset.path == iterations) {
        const currentlyVisitedCell = unvisited[i];
        currentlyVisitedCell.classList.remove('discovered-node');
        currentlyVisitedCell.classList.add('visited-node-1');
        currentlyVisitedNewNeighbours = await findUnvisitedNeighbours(currentlyVisitedCell);
        visited.push(currentlyVisitedCell);
        unvisited = unvisited.concat(currentlyVisitedNewNeighbours);
        delete unvisited[i] in unvisited;
      };

      if (bombStart == true && unvisited[i].dataset.path == iterations) {
        const currentlyVisitedCell = unvisited[i];
        currentlyVisitedCell.classList.remove('discovered-node-2');
        currentlyVisitedCell.classList.add('visited-node-2');
        currentlyVisitedNewNeighbours = await findUnvisitedNeighbours(currentlyVisitedCell);
        visited.push(currentlyVisitedCell);
        unvisited = unvisited.concat(currentlyVisitedNewNeighbours);
        delete unvisited[i] in unvisited;
      };

      if (Array.isArray(currentlyVisitedNewNeighbours) == false && currentlyVisitedNewNeighbours.includes('bomb')) {
        running = false;
        i = numberToVisit;
        target = currentlyVisitedNewNeighbours;
        shouldExit = true;
        console.log(currentlyVisitedNewNeighbours);
        const newStart = document.getElementById(currentlyVisitedNewNeighbours);
        console.log(newStart);
        calculatePathToBomb(tracker, newStart.id);
        dijkstraAlgo(newStart, false, true);
        return;
      };

      if (Array.isArray(currentlyVisitedNewNeighbours) == false && currentlyVisitedNewNeighbours.includes('bomb') == false) {
        running = false;
        i = numberToVisit; // so that we don't perform this loop > once, since the target can be the neigbour of more than one cell in the unvisited[] we are iterating over.
        target = currentlyVisitedNewNeighbours;
      }
    };
    if (unvisited.every((element) => element == undefined)) return; // to stop infinite loops if there is no path from start to target. This is a solution but it is not scalale, since the difference in the rate of growth between unvisited.length - iterations increases exponenttially
    iterations++;
  };

  if (shouldExit == false) {
    calculatePath(tracker, target);
  }
};

// function to find unvisited neighbours
const speedSelection = document.getElementById('speed-button');

const findUnvisitedNeighbours = async (currentCell) => {
  const yCoord = getCoord(currentCell, 'y');
  const xCoord = getCoord(currentCell, 'x');
  const y = parseInt(yCoord);
  const x = parseInt(xCoord);

  const rightNeighbour = findNeighbours(x, y, 0, -1);
  const aboveNeighbour = findNeighbours(x, y, 1, 0);
  const belowNeighbour = findNeighbours(x, y, -1, 0);
  const leftNeighbour = findNeighbours(x, y, 0, 1);
  console.log(bomb);
  const neighbours = [rightNeighbour, aboveNeighbour, leftNeighbour, belowNeighbour];
  const unvisitedNeighbours = [];

  for (let z = 0; z < neighbours.length; z++) { // loop within a loop but max length neighbours can ever be is 4.
    if (neighbours[z] == undefined ||
      neighbours[z].classList.contains('wall-node') ||
      neighbours[z].id.includes('start')) {
      continue;
    }

    if (bombStart == false && (neighbours[z].classList.contains('visited-node-1') ||
      neighbours[z].classList.contains('discovered-node'))) {
      continue;
    }

    if (bombStart == true && (neighbours[z].classList.contains('visited-node-1') ||
      neighbours[z].classList.contains('discovered-node'))) {
      neighbours[z].classList.remove('visited-node-1');
      neighbours[z].classList.remove('discovered-node');
    }

    if (bombStart == true && (neighbours[z].classList.contains('visited-node-2') ||
      neighbours[z].classList.contains('discovered-node-2'))) {
      continue;
    }

    neighbours[z].dataset.direction = z + 1; // handily sets our dynamic number-direction system

    rotationCost(currentCell, neighbours[z]);

    if (neighbours[z].innerHTML == weightNodeSelect) {
      neighbours[z].dataset.path = parseInt(neighbours[z].dataset.path) + 10;
    }

    if (currentCell.id.includes('start')) {
      currentCell.classList.add('shortest-path-node');
    }

    if (neighbours[z].innerHTML == targetNodeSelect && bomb == false) {
      neighbours[z].classList.add('shortest-path-node');
      updateTracker(currentCell, neighbours[z]);
      console.log(`target id is ${neighbours[z].id}`);
      return neighbours[z].id;
    }

    if (neighbours[z].innerHTML == bombNodeSelect) {
      bomb = false;
      neighbours[z].classList.add('visited-node-1');
      neighbours[z].id += ' bomb';
      updateTracker(currentCell, neighbours[z]);
      console.log(neighbours[z].id);
      return neighbours[z].id;
    }

    neighbours[z].classList.add('visiting-node');
    await addDelay(speedSelection.value);
    neighbours[z].classList.remove('visiting-node');

    bombStart == false ? neighbours[z].classList.add('discovered-node') : neighbours[z].classList.add('discovered-node-2');
    updateTracker(currentCell, neighbours[z]);
    unvisitedNeighbours.push(neighbours[z]);
  };

  return unvisitedNeighbours;
};

const updateTracker = (currentCell, neighbour) => {
  tracker[neighbour.id] = currentCell.id;
};

const findNeighbours = (currentX, currentY, ySubtrahend, xSubtrahend) => {
  const neighbour = gridCells.find((cell) => parseInt(getCoord(cell, 'y')) == currentY - ySubtrahend &&
    parseInt(getCoord(cell, 'x')) == currentX - xSubtrahend);
  return neighbour;
};

const rotationCost = (currentNode, neighbour) => {
  const currentDirectionInt = parseInt(currentNode.dataset.direction);
  const neighbourInt = parseInt(neighbour.dataset.direction);
  const result = currentDirectionInt - neighbourInt < 0 ? ((currentDirectionInt - neighbourInt) * -1) : (currentDirectionInt - neighbourInt);

  switch (result) {
    case (0):
      // add 1 to number of iterations
      neighbour.dataset.path = iterations + 1;
      return;
    case (1):
      // add 2 to shortest path, quarter turn
      neighbour.dataset.path = iterations + 2;
      return;
    case (3):
      // add 2 to shortest path, quarter turn
      neighbour.dataset.path = iterations + 2;
      return;
    case (2):
      // add 3 to shortest path. This should only happen once at the very start? half turn
      neighbour.dataset.path = iterations + 3;
      return;
  }
};

// function to calculate shortest path once target found
export const path = [];
export const path2 = [];
let finalPath;
const calculatePath = (tracker, targetId) => {
  const previousCell = targetId;
  console.log(tracker);
  console.log(path);
  console.log(targetId);
  if (tracker[previousCell].includes('start') || tracker[previousCell].includes('bomb')) {
    console.log(bombStart);
    if (bombStart == false) {
      path.unshift(previousCell);
    } else {
      path2.unshift(previousCell);
    }
    finalPath = path.concat(path2);
    console.log(finalPath);
    showPath(finalPath);
    return;
  } else {
    if (bombStart == false) {
      path.unshift(previousCell);
    } else {
      path2.unshift(previousCell);
    }
    calculatePath(tracker, tracker[previousCell]);
  };
};

const calculatePathToBomb = (tracker, targetId) => {
  const previousCell = targetId;
  console.log(previousCell);
  if (tracker[previousCell].includes('start')) {
    path.unshift(previousCell);
    return;
  } else {
    path.unshift(previousCell);
    calculatePathToBomb(tracker, tracker[previousCell]);
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

// we want to delete the key that discovers the bomb as a neighbour i.e. the key that is the id of the bomb node with a value of it's discoverer node
// do we want to have the tracker update such that the node that discovers the bomb node (which therefor has to be part of shortest path)
// is persisted as being the previous node to the bomb? what if the bomb node 'rediscovers' this node as part of its path to the target?
// i.e. the path from start to bomb and the path from bomb to target traverse the same nodes?
// may need two trackers.
