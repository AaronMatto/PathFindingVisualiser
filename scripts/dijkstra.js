/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable require-jsdoc */
import {gridCells, startNodeSelect, targetNodeSelect, addDelay} from './app.js';

const getCoord = (cell, z) => {
  return cell.getAttribute(`data-${z}`);
};

export const tracker = {};
let iterations;
export const dijkstraAlgo = async (startcell) => {
  const visited = [];
  let unvisited = [startcell];
  iterations = 0;
  startcell.dataset.direction = '1';
  startcell.dataset.path = '0';
  let target;
  let running = true;
  let currentlyVisitedNewNeighbours;


  while (running == true) {
    const numberToVisit = unvisited.length;
    for (let i = 0; i < numberToVisit; i++) {
      if (unvisited[i] == undefined) continue;

      if (unvisited[i].dataset.path == iterations) {
        const currentlyVisitedCell = unvisited[i];
        currentlyVisitedCell.classList.remove('discovered-node');
        currentlyVisitedCell.classList.add('visited-node-1');
        currentlyVisitedNewNeighbours = await findUnvisitedNeighbours(currentlyVisitedCell);
        visited.push(currentlyVisitedCell);
        unvisited = unvisited.concat(currentlyVisitedNewNeighbours);
        delete unvisited[i] in unvisited;
      };

      if (Array.isArray(currentlyVisitedNewNeighbours) == false) {
        running = false;
        i = numberToVisit; // so that we don't perform this loop > once, since the target can be the neigbour of more than one cell in the unvisited[] we are iterating over.
        target = currentlyVisitedNewNeighbours;
      }
    };
    console.log(iterations);
    console.log(unvisited);
    if (iterations > unvisited.length ) return; // to stop infinite loops if there is no path from start to target. This is a solution but it is not scalale, since the difference in the rate of growth between unvisited.length - iterations increases exponenttially
    iterations++;
  };
  calculatePath(tracker, target);
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

  const neighbours = [rightNeighbour, aboveNeighbour, leftNeighbour, belowNeighbour];
  const unvisitedNeighbours = [];

  for (let z = 0; z < neighbours.length; z++) { // loop within a loop but max length neighbours can ever be is 4.
    if (neighbours[z] == undefined) {
      continue;
    }

    if (neighbours[z].classList.contains('visited-node-1') ||
      neighbours[z].classList.contains('discovered-node') ||
      neighbours[z].classList.contains('wall-node') ||
      neighbours[z].id.includes('start')) {
      continue;
    }

    neighbours[z].dataset.direction = z + 1; // handily sets our dynamic number-direction system

    rotationCost(currentCell, neighbours[z]);

    if (currentCell.id.includes('start')) {
      currentCell.classList.add('shortest-path-node');
    }

    if (neighbours[z].innerHTML == targetNodeSelect) {
      neighbours[z].classList.add('visited-node-1');
      updateTracker(currentCell, neighbours[z]);
      return neighbours[z].id;
    }

    neighbours[z].classList.add('visiting-node');
    await addDelay(speedSelection.value);
    neighbours[z].classList.remove('visiting-node');
    neighbours[z].classList.add('discovered-node');
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
const calculatePath = (tracker, targetId) => {
  const previousCell = targetId;
  if (tracker[previousCell].includes('start')) {
    path.unshift(previousCell);
    showPath(path);
    return;
  } else {
    path.unshift(previousCell);
    calculatePath(tracker, tracker[previousCell]);
  };
};

const showPath = async (pathIdArray) => {
  for (let j = 0; j < pathIdArray.length; j++) {
    const pathDiv = document.getElementById(parseInt(pathIdArray[j]));
    pathDiv.classList.remove('visited-node-1');
    pathDiv.classList.add('shortest-path-node');
    await addDelay('medium');
  };
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


// Update:
// What I should have done (but didn't want to) was create a node/cell class that has the properties of previousCell, distance from start,
// isTarget, isStart etc. A class representing a node presents us with a much easier data structure to implement the algorithm.

// Improvements:
// when complete, have a file of the shared toolset for each algorithm, call it tools.js
// then for each algorithm seperate out what is unique to each algorithm, and name the file
// [insertAlgoName].js


// need to reimplement shortest path with node object to optimise for rotation
// record the direction facing of the start node: right
// for the currently visited cell, record for each of its neighbours whether visiting
// that neighbour would require a rotation based on the direction the start cell would be facing
// if it were to travel to the currently visited cell
// if that neighbour requires a rotation, increment the cost of visiting it by one and capture this
// so that when we calculate the shortest path, rotation costs are facotred in

// so if node x has already been visited by node y, but to get from x to y we had
// think of an L shape
