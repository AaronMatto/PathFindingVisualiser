/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable padded-blocks */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import {gridCells, targetNodeSelect, bombNodeSelect, addDelay} from './app.js';

/*
A*:
A* is different to dijsktra in that it focuses on the shortest path between two specific nodes
as opposed to the shortest path from a start node to all nodes in the tree/graph
We need two things: the distance from the start node to its immediate neighbours g(n) and
the estimated distance from those neighbours to the goal h(n)

From the current node, we can add g(n) and h(n) together and decide which one to visit next
from which neighbour has the lowest value for this sum.

h(n) could be the euclidean distance from each neighbour to the goal.

MANHATTAN WORKS BETTER ALONG GRIDS since movement is restricted to up/down and left/right.

*/
const speedSelection = document.getElementById('speed-button');
let tracker;
let target;
let targetX;
let targetY;
let iterations;

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
  iterations = 0;
  startcell.dataset.direction = startingDirection;
  startcell.dataset.path = '0';
  startcell.dataset.astar = '0';



  while (targetReached == false) {


    const numberToVisit = unvisited.length;
    console.log("   ");
    console.log('ENTER FOR LOOP');
    sortUnvisitedBySum(unvisited);
    console.log(unvisited);
    for (let i = 0; i < numberToVisit; i++) {
      const currentlyVisitedNode = unvisited[i];
      if (unvisited[i] == undefined) continue;


      if (currentlyVisitedNode.classList.contains('discovered-node')) {
        currentlyVisitedNode.classList.remove('discovered-node');
        currentlyVisitedNode.classList.add('visited-node-1');
      }

      currentlyVisitedNewNeighbours = await findUndiscoveredNeighbours(currentlyVisitedNode);

      visited.push(currentlyVisitedNode);

      unvisited.splice(i, 1);

      unvisited = currentlyVisitedNewNeighbours.concat(unvisited);


      if (unvisited.length - numberToVisit > 0) {
        break;
      }

    };
    console.log('OUT FOR LOOP');
    iterations++;
  }
};



const sortUnvisitedBySum = (unsortedDiscoveredNodeArray) => {
  unsortedDiscoveredNodeArray.sort((a, b) => parseFloat(a.dataset.astar) - parseFloat(b.dataset.astar));
};




const findUndiscoveredNeighbours = async (currentCell) => {

  const y = getCoord(currentCell, 'y');
  const x = getCoord(currentCell, 'x');

  const rightNeighbour = findNeighbour(x, y, 0, -1);
  const aboveNeighbour = findNeighbour(x, y, 1, 0);
  const belowNeighbour = findNeighbour(x, y, -1, 0);
  const leftNeighbour = findNeighbour(x, y, 0, 1);
  const neighbours = [rightNeighbour, aboveNeighbour, leftNeighbour, belowNeighbour];

  const undiscoveredNeighbours = await iterateOverNeighbours(currentCell, neighbours);

  if (currentCell.id.includes('start')) {
    currentCell.classList.add('shortest-path-node');
  }

  // sortUnvisitedBySum(undiscoveredNeighbours);

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

    // if (neighbours[z].classList.contains('discovered-node')) {

    //   // find what the current shortest path to that node is
    //   let knownPath = parseInt(neighbours[z].dataset.path);
    //   let currentPath = rotationCost()

    // };

    if (neighbours[z] == undefined ||
      neighbours[z].classList.contains('visited-node-1') ||
      neighbours[z].classList.contains('discovered-node') ||
      neighbours[z].classList.contains('wall-node') ||
      neighbours[z].id.includes('start')) {
      continue;
    };

    neighbours[z].dataset.direction = z + 1; // handily sets our dynamic number-direction system

    updateTracker(currentCell, neighbours[z]); // if key does not exist?

    rotationCost(currentCell, neighbours[z]);

    if (neighbours[z].classList.contains('weight-node')) {
      neighbours[z].dataset.path = parseInt(neighbours[z].dataset.path) + 10;
    }

    setAStarSumDistance(neighbours[z]);



    if (neighbours[z].innerHTML == targetNodeSelect && bomb == false) {
      neighbours[z].classList.add('shortest-path-node');
      updateTracker(currentCell, neighbours[z]);
      return neighbours[z].id;
    }

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

  const horizontalDistanceSqrd = (targetX - xCoord)**2;
  const verticalDistanceSqrd = (targetY - yCoord)**2;
  const verticalDistance = (verticalDistanceSqrd)**0.5;
  const horizontalDistance = (horizontalDistanceSqrd)**0.5;
  const manhattan = verticalDistance + horizontalDistance;
  neighbour.dataset.astar = (manhattan + parseInt(neighbour.dataset.path));
};



const updateTracker = (currentCell, neighbour) => {
  tracker[neighbour.id] = currentCell.id;
};


const shortestPathToCurrentNode = (currentNode, neighbour) => {

  /*

  If the neighbour of the currently visited node is already discovered

    - compare the path to the neighbour via the node we are visiting to the known shortest path
    to that neighbour. Of course, this means the neighbour has already been discovered but not visited.
    If the path to the neighbour via node we are visiting is smaller,
    update the previous node value for that neighbour id key in tracker {}. Remember to factor
    rotation cost into this comparison.
    That neighbour will already have a key. The new value for that key will be the id of the current node.

    - If path via current node is not shorter, dont update the value.
    Remember the path via the current node is the path value of the current node
    PLUS any rotational costs

  If the the neighbour of the currently visited node is not discovered

    - update tracker as [neighbourId] = [currentnodeId]

  return the value for the key that is the id of the current node:
  tracker[idOfCurrentlyVisitedNode] = idOfNodeThatDiscoveredCurrentlyVisited
  */

  if (neighbour.classList.contains('discovered-node')) {
    console.log('FAIL');
  } else {
    const shortestPathToCurrentCell = currentNode.dataset.path;
    return parseInt(shortestPathToCurrentCell);
  }




};

/*
the order in which we discover and subsequently visit:

in dijksta...this was captured by the notion of iterations and rotations.
by only being able to visit nodes whosse path value matched the number of iterations:
it meant that we ensured we visited nodes that had been discovered in the correct order...
i.e. a node we have to rotate to reach has an additional cost and would therefore be lower
in the priority queue to visit than a node facing the same direction


in a*, we have to capture the same notion except the order in which we visit nodes is different.
Instead of visitng nodes by making locally optimal choices based on immediate distance from
current node....the next choice is based on both the locally optimal distance PLUS that neighbour
nodes distance to the finish.
So...for each neighbour I need to grab the nodes' data path-path value and add it to to the nodes'
h(n) value.

*/


// should I sort the whole thing here or can sorting be broken down and done
// throughout the method chain?
/* if I sort in the chain it would have to be in findUnDiscoveredNeighbours.
Upon discovering the undiscovered neighbours, they can be sorted in terms of their sum.
Then, when these neighbours are returned, they can be unshifted (added to the start)
of the unvisited array. The assumption here is that any newly discovered neighbours
from the current node will always have a smaller sum than the node with the smallest
sum currently in the unvisited array (the one at the front of it).
This seems logical.

The question now is how do I dynamically insert into the undiscovered array to bring the newly discovered
neighbour with the smallest sum to be visited next
the key is the length of currentlyVisitedNewNeighbours.
If no new neighbours are discovered, it has length 0 and
unvisited array therefore remains the same
if new neighbours are discovered it has a non-zero length. If this is true we can reset i
to 0 to ensure we start the iteration again and now visit the discovered neighbour
with the lowest sum.
This way all nodes in undiscovered will be in order of their sum value too.

*/


/*
I need to change the behaviour of the priority of unvisited queue. In other words, the order
must constantly place any discovered node with the lowest sum value at the front.
This includes during an iteration where we are visiting the nodes discovered by the previous
iteration. If a discovered node in the current iteration has a smaller sum than any other
nodes it must be visited before those other nodes, despite it being discovered in a subsequent iteration.
This is different to dijsktra.

This means in a straight line from start point to target we dont even visit all 4 squares
around the start.

We discover all 4 then visit the one with the smallest sum. Then we discover the 3 around that
node and visit the one with the smallest sum. And so on.
We'd never visit the other 3 around the start this way.

So, we'd wanna sort our queue after visiting any node in our unvisited list.

e.g. a straight line above the start
Is this correct? Well after visiting the start node and discovering all of its 4 initial neighbours:
all the neighbours are added to unvisited and we sort it before beginning the next iteration.
In the next iteration we visit the discovered neighbour with the lowest sum value as the list has been sorted.
When we visit this neighbour (say above), we discover its neighbours.
Its neighbours will have a lower sum value than any of the other 3 initial neighbours of the start.
At this point, in order to visit those new neighbours before the initial 3 (as they have a lower sum),
we must resort the undiscovered list.
*/
