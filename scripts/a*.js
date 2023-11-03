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

start (22, 9)
target (38,4)
iteration one:

  Left neighbour (21,9):
    euclidean = 17sq + 5sq = 314 --> h(n) = 17.72
    g(n) = 3
    sum = 20.72

  Right neighbour (23,9)
    euclidean = 15sq + 5sq = 250 --> h(n) = 15.81
    g(n) = 1
    sum = 16.81

  Up neighbour (22,8)
    euclidean = 16sq + 4sq = 256 + 16 --> h(n) = 16.49
    g(n) = 2
    sum = 18.49

  Down neigbour (22,10)
    euclidean = 16sq + 6sq = 256 + 36 --> h(n) = 17.09
    g(n) = 2
    sum = 19.09

  we go to the right neigbour.

start (23, 9)
target (38,4)
iteration two:

  Left neighbour (22,9):
  we were just there

  Right neighbour (24,9)
    euclidean = 14sq + 5sq = 221 --> h(n) = 14.87
    g(n) = 1
    sum = 15.87

  Up neighbour (23,8)
    euclidean = 15sq + 4sq = 241--> h(n) = 15.52
    g(n) = 2
    sum = 17.72

  Down neigbour (23,10)
    euclidean = 15sq + 6sq = 261 --> h(n) = 16.16
    g(n) = 2
    sum = 18.16

  we go to the right neigbour again.

The heuristic will always favor going right until reducing the horizontal distance no longer has a greater effect
on the sum than reducing the vertical distance.

when we reach (33, 9):
target (38,4)
iteration:

 Left neighbour (32,9):
  we were just there

  Right neighbour (34,9)
    euclidean = 4sq + 5sq = 41 --> h(n) = 6.40
    g(n) = 1
    sum = 7.40

  Up neighbour (33,8)
    euclidean = 5sq + 4sq = 41 --> h(n) = 6.40
    g(n) = 2
    sum = 8.40

  Down neigbour (33,10)
    euclidean = 5sq + 6sq = 61 --> h(n) = 7.81
    g(n) = 2
    sum = 9.81

    we go to the right neigbour again...b   ut h(n) no longer favors right neighbour, g(n) still does

  so do we reach a point where h(n) for up is less than h(n) for right by an amount more than
  the difference between g(n) for up neighbour and down neighbour. In this case more than 1.
  i.e. h(n) up neighbour has to be less than h(n) right neighbour by more than 1

when we reach (34,9)
target (38,4)
iteration:

  Right neighbour (35,9)
  euclidean = 3sq + 5sq = 34 --> h(n) = 5.83
  g(n) = 1
  sum = 6.83

  Up neighbour (34,8)
  euclidean = 4sq + 4sq = 32 --> h(n) = 5.65
  g(n) = 2
  sum = 7.65

  go right


when we reach (35,9)
target (38,4)
iteration:

  Right neighbour (36,9)
  euclidean = 2sq + 5sq = 29 --> h(n) = 5.39
  g(n) = 1
  sum = 6.39

  Up neighbour (35,8)
  euclidean = 3sq + 4sq = 25 --> h(n) = 5
  g(n) = 2
  sum = 7

  go right

when we reach (36,9)
target (38,4)
iteration:

  Right neighbour (37,9)
  euclidean = 1sq + 5sq = 26 --> h(n) = 5.10
  g(n) = 1
  sum = 6.10

  Up neighbour (36,8)
  euclidean = 2sq + 4sq = 20 --> h(n) = 4.47
  g(n) = 2
  sum = 6.47

  go right

when we reach (37,9)
target (38,4)
iteration:

  Right neighbour (38,9)
  euclidean = 0sq + 5sq = 25 --> h(n) = 5
  g(n) = 1
  sum = 6

  Up neighbour (37,8)
  euclidean = 1sq + 4sq = 17 --> h(n) = 4.12
  g(n) = 2
  sum = 6.12

  go right

when we reach (38,9)
target (38,4)
iteration:

  Right neighbour (39,9)
  euclidean = 1sq + 5sq = 26 --> h(n) = 5.10
  g(n) = 1
  sum = 6.10

  Up neighbour (38,8)
  euclidean = 0sq + 4sq = 16 --> h(n) = 4
  g(n) = 2
  sum = 6

  go up.
  Confirmed..at the point we travel to a node directly below the target, h(n) for the above
  neighbour is less than h(n) for the right neighbour (which increases again) by more than 1
  ...meaning the sum for the above neighbour is finally less given g(n) was constant.
  In the next iteration g(n) would flip for each neighbour, so would be 2 for right neighbour
  and 1 for up neighbour.



going from (2,2) to (3,3)

iteration 1
target (3,3)
iteration:

  Right neighbour (3,2)
  euclidean = 0sq + 1sq = 1 --> h(n) = 1
  g(n) = 1
  sum = 2

  Up neighbour (2,3)
  euclidean = 1sq + 0sq = 1 --> h(n) = 1
  g(n) = 2
  sum = 3

  go right

iteration 2 (3,2)
target (3,3)
iteration:

  Right neighbour (4,2)
  euclidean = 1sq + 1sq = 2 --> h(n) = root2
  g(n) = 1
  sum = root2 + 1 > 2

  Up neighbour (3,3)
  euclidean = 0sq + 0sq = 0 --> h(n) = 0
  g(n) = 2
  sum = 2

  go right
*/




/*
how do I sort the queue?

we visit nodes in an order based on their sum value
for each of those nodes we discover all adjacent neighbours
out of those neighbours we prioritise visiting the one with the lowest sum: h(n) + g(n)

if we re-discover a node and its actual distance g(n) via the current node is less than the
actual distance currently recorded via a different node, we still update the actual distance
for visiting that node. Like dijsktra.

so i'd have to sort the unvisited/discovered list based on the sum value


psuedo-code:

global variable for target node?

function aStarSearch:
  this function contains:
  - a list of visited nodes
  - a list of discovered nodes
  - an iterator to keep track of what iteration (number of steps we can travel) we are on
  - a flag to stop when we have reached the target

  behaviour:
  - we sort discovered nodes based on euclidean distance (h(n)) to the target

  - a loop that loops over the discovered nodes that have been sorted
    - in the loop we call discoverNeighbours
    - at the end of the loop we add newly discovered neighbours to the list of discovered nodes
    - we remove node we just visited from discovered nodes and add it to visited nodes
    - increment iterator

  - call tracePath

function discoverNeighbours(currentNode):

  contains:
  - an array that will be returned containing all the newly discovered nodes, newlyDiscovered
  - an array that contains all the currentNode's neighbours, currentlyVisitedNeighbours

  behaviour:

  a loop to iterate over currentlyVisitedNeighbours
    - has this neighbour been discovered or not?
    - if a neighbour has been discovered will contain the class 'discovered' and we skip over this iteration
    - if it hasn't been discovered:
      - calulate its euclidean distance from the target
      - caclulate its rotational cost
      - add discovered class to it
      - add it to newlyDiscovered
      - update the tracker to say the current node is the one that discovered that neighbour
  -

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

export const aStarSearch = (startcell, startingDirection) => {

  getTargetCoords();
  const visited = [];
  let unvisited = [startcell];
  let iterations = 0;
  let targetReached = false;
  let tracker = {};
  startcell.dataset.direction = startingDirection;
  startcell.dataset.path = '0';

  while (targetReached == false) {

    sortUnvisitedBySum(unvisited);

    for (let i = 0; i < unvisited.length; i++) {

      if (unvisited[i] == undefined) continue;


      if (unvisited[i].dataset.path == iterations) { // must fix this
        const currentlyVisitedNode = unvisited[i];

        currentlyVisitedNewNeighbours = findUnvisitedNeighbours(currentlyVisitedNode);

        visited.push(currentlyVisitedNode);
        unvisited = unvisited.concat(currentlyVisitedNewNeighbours);
        delete unvisited[i] in unvisited;
      };

    };
    iterations++;
  };
};



const sortUnvisitedBySum = (unsortedDiscoveredNodeArray) => {
  unsortedDiscoveredNodeArray.sort((a, b) => a.dataset.aStar - b.dataset.aStar);
};




const findUnvisitedNeighbours = (currentCell) => {

  const yCoord = getCoord(currentCell, 'y');
  const xCoord = getCoord(currentCell, 'x');
  const y = parseInt(yCoord);
  const x = parseInt(xCoord);

  const rightNeighbour = findNeighbours(x, y, 0, -1);
  const aboveNeighbour = findNeighbours(x, y, 1, 0);
  const belowNeighbour = findNeighbours(x, y, -1, 0);
  const leftNeighbour = findNeighbours(x, y, 0, 1);
  const neighbours = [rightNeighbour, aboveNeighbour, leftNeighbour, belowNeighbour];

  const unvisitedNeighbours = iterateOverNeighbours(neighbours);

  if (currentCell.id.includes('start')) {
    currentCell.classList.add('shortest-path-node');
  }

  return unvisitedNeighbours;
};






const findNeighbours = (currentX, currentY, ySubtrahend, xSubtrahend) => {
  const neighbour = gridCells.find((cell) => parseInt(getCoord(cell, 'y')) == currentY - ySubtrahend &&
    parseInt(getCoord(cell, 'x')) == currentX - xSubtrahend);
  return neighbour;
};





const iterateOverNeighbours = async (neighbours) => {

  const undiscoveredNeighbours = [];

  for (let z = 0; z < neighbours.length; z++) {
    if (neighbours[z] == undefined ||
      neighbours[z].classList.contains('discovered-node') ||
      neighbours[z].classList.contains('visited-node-1') ||
      neighbours[z].classList.contains('wall-node') ||
      neighbours[z].id.includes('start')) {
      continue;
    };

    neighbours[z].dataset.direction = z + 1; // handily sets our dynamic number-direction system

    rotationCost(currentCell, neighbours[z]);

    setAStarSumDistance(neighbours[z]);

    if (neighbours[z].classList.contains('weight-node')) {
      neighbours[z].dataset.path = parseInt(neighbours[z].dataset.path) + 10;
    }

    if (neighbours[z].innerHTML == targetNodeSelect && bomb == false) {
      neighbours[z].classList.add('shortest-path-node');
      updateTracker(currentCell, neighbours[z]);
      return neighbours[z].id;
    }

    neighbours[z].classList.add('visiting-node');
    await addDelay(speedSelection.value);
    neighbours[z].classList.remove('visiting-node');

    updateTracker(currentCell, neighbours[z]);
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
  };
};




const setAStarSumDistance = (neighbour) => {
  const yCoord = getCoord(neighbour, 'y');
  const xCoord = getCoord(neighbour, 'x');

  horizontalDistance = (targetX - xCoord)**2;
  verticalDistance = (targetY - yCoord)**2;
  euclidean = (horizontalDistance + verticalDistance)**0.5;

  neighbour.dataset.aStar = (euclidean.toFixed(4) + neighbour.dataset.path);
};





const updateTracker = (currentCell, neighbour) => {
  tracker[neighbour.id] = currentCell.id;
};

/*
the order in which we discover and subsequently visit:

in dijksta...this was captured by the notion of iterations and rotations.
by only being able to visit nodes whosse path value matched the number of iterations:
it meant that we ensured we visited nodes that had been discovered in the correct order...
i.e. a node we have to rotate to reach has an additional cost and would therefore be lower
in the priority queue to visit than a node facing the same direction


in a*, we have to capture the same notion except the order in which we visit nodes.
Except, instead of visitng nodes by making locally optimal choices based on immediate distance from
current node....the next choice is based on both the locally optimal distance PLUS that neighbour
nodes distance to the finish.
So...for each neighbour I need to grab each the nodes' data path-path value and add it to to the nodes'
h(n) value.

*/
