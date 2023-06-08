/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

import { nodesArray } from './app.js';

export const dijkstraAlgorithm = async (startNode) => {
  const visited = [];
  let unvisited = [startNode];
  let iterations = 1;
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
  const aboveNeighbour = findNeighbours(x, y, 1, 0);
  const belowNeighbour = findNeighbours(x, y, -1, 0);
  const leftNeighbour = findNeighbours(x, y, 0, 1);
  const neighbours = [rightNeighbour, aboveNeighbour, leftNeighbour, belowNeighbour];
  const unvisitedNeighbours = [];

  for (let z = 0; z < neighbours.length; z++) {
    if (neighbours[z] == undefined) {
      continue;
    }
  };

  return unvisitedNeighbours;
};

const updateTracker = (currentCell, neighbour) => {
  tracker[neighbour.id] = currentCell.id;
};

const trackNeighbours = () => {

  // keeps shortest dist to each neighbour
};

const findNeighbours = (currentX, currentY, ySubtrahend, xSubtrahend) => {
  const neighbour = nodesArray.find((node) => node.y == currentY - ySubtrahend &&
    node.x == currentX - xSubtrahend);

  return neighbour;
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
// more steps (from rotation) to visit that different neighbour that discovered the same node
//
