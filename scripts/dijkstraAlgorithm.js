/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

import { nodesArray } from './app.js';

let iterations = 1;

export const dijkstraAlgorithm = async (startNode) => {
  startNode.direction = 1;
  const visited = [];
  let unvisited = [startNode];
  let target;
  let running = true;

  while (running = true) {
    const numberToVisit = unvisited.length;

    for (let i = 0; i < numberToVisit; i++) {
      const currentlyVisitedCell = unvisited[i];
      const newNeighbours = await findUnvisitedNeighbours(currentlyVisitedCell);

      if (Array.isArray(currentlyVisitedNewNeighbours) == false) {
        running = false;
        i = numberToVisit; // so that we don't perform this code > once, since the target can be the neigbour of more than one cell in the unvisited[] we are iterating over.
        target = currentlyVisitedNewNeighbours;
      }
    }
  }
};

// function to find unvisited neighbours
const speedSelection = document.getElementById('speed-button');

const findUnvisitedNeighbours = async (currentNode) => {
  const y = currentNode.y;
  const x = currentNode.x;
  const directionFacing = currentNode.direction;

  const rightNeighbour = findNeighbours(x, y, 0, -1);
  rightNeighbour.direction = 1;
  const aboveNeighbour = findNeighbours(x, y, 1, 0);
  aboveNeighbour.direction = 4;
  const belowNeighbour = findNeighbours(x, y, -1, 0);
  belowNeighbour.direction = 2;
  const leftNeighbour = findNeighbours(x, y, 0, 1);
  leftNeighbour.direction = 3;
  const neighbours = [rightNeighbour, aboveNeighbour, leftNeighbour, belowNeighbour];
  const unvisitedNeighbours = [];

  for (let z = 0; z < neighbours.length; z++) {
    if (neighbours[z] == undefined) {
      continue;
    }

    if (neighbours[z].isTarget == true) {

    }

    if (neighbours[z].isWall == true || neighbours[z].visited == true) { // would have to iterate over grid to find which are walls
      continue;
    }

    findDirection(directionFacing, neighbours[z]);

    neighbours[z].classList.add('visiting-node');
    await addDelay(speedSelection.value);
    neighbours[z].classList.remove('visiting-node');
    neighbours[z].classList.add('visited-node-1');
    updateTracker(currentCell, neighbours[z]);
    unvisitedNeighbours.push(neighbours[z]);
  };

  return unvisitedNeighbours;
};

const updateTracker = (currentCell, neighbour) => {
  tracker[neighbour.id] = currentCell.id;
};

const trackNeighbours = () => {

};

const findNeighbours = (currentX, currentY, ySubtrahend, xSubtrahend) => {
  const neighbour = nodesArray.find((node) => node.y == currentY - ySubtrahend &&
    node.x == currentX - xSubtrahend);

  return neighbour;
};

const findDirection = (currentDirection, neighbour) => {
  const result = currentDirection - neighbour.direction < 0 ? ((currentDirection - neighbour.direction) * -1) : (currentDirection - neighbour.direction);

  switch (result) {
    case (0):
      // add nothing to number of rotations
      return;
    case (1):
      // add 1 to number of rotations
      neighbour.shortestPath = iterations + 1;
      return;
    case (3):
      // add 1 to number of rotations
      neighbour.shortestPath = iterations + 1;
      return;
    case (2):
      // add 2 to the number of rotations. This should only happen once at the very start?
      neighbour.shortestPath = iterations + 2;
      return;
  }
};


// what is the direction of the current node?
// if it is 'R':
// we know it will cost 1 to rotate for above or below neighbour
// we know it will cost 2 to rotate for left neighbour
// will cost 0 for right neighbour

// switch statement for every direction

// then we know the cost of travelling to that neighbour

// we only mark that neighbour as visited when the number of iterations matches the distance required
// to travel to it

// can we visit a neighbour then find a shorter path to it? i.e. will the number of iterations
// always be the shortest path to that node from the start?
// yes, because visiting the same node from a different neighbour would mean it required
// more steps (from rotation) and therefor iterations to visit that different neighbour that discovered the same node
// This is key because it also means that whenever we discover a node,
// the direction we would be facing when travelling to it would be the direction
// we travelled last to discover it
// Meaning, the direction property of a node should be set by what kind of neighbour it is.

// the way this is built then means that we'd never have to compare two routes to the same
// node as the one found by default has to be the shortest so no need to update shortest dist to node

// could do even or odd for number of rotations instead of 0,1,2 and 3


// perhaps I could simply modify the other original algo to add the rotation functionality?
