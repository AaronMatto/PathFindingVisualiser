/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable padded-blocks */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
// REFACTOR needed
import {gridCells, targetNodeSelect, bombNodeSelect, addDelay, path} from './app.js';

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


export const aStarSearch = async (startcell, startingDirection, isBomb, bombStart) => {
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
        aStarSearch(newStart, bombStartDirection, bombExists, true);
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
  await showPath(path);
};


const sortUnvisitedBySum = (unsortedDiscoveredNodeArray) => {
  unsortedDiscoveredNodeArray.sort((a, b) => {
    const aStarDiff = parseInt(a.dataset.astar) - parseInt(b.dataset.astar);
    const pathDiff = parseInt(b.dataset.path) - parseInt(a.dataset.path);

    if (aStarDiff == 0 && pathDiff == 0) {
      // If astar and path values are the same, prioritize the node added first
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
      neighbours[z].classList.contains('wall-node')) {
      continue;
    };

    if (isBombStart == true) {

      if (neighbours[z].id.includes('start')) {
        neighbours[z].id = neighbours[z].id.replace(' start', '');
      };

      if (neighbours[z].classList.contains('discovered-node-2')) {
        const newDistance = isItShorter(currentCell, neighbours[z], z);
        undiscoveredNeighbours.push(newDistance);
        continue;
      };

      if (neighbours[z].classList.contains('visited-node-1') ||
        neighbours[z].classList.contains('discovered-node') ) {
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
      const newDistance = isItShorter(currentCell, neighbours[z], z);
      undiscoveredNeighbours.push(newDistance);
      continue;
    } else {
      neighbours[z].dataset.direction = z + 1; // sets our dynamic number-direction system
      updateTracker(currentCell, neighbours[z]);
      rotationCost(currentCell, neighbours[z]);
    };

    if (neighbours[z].classList.contains('weight-node')) {
      neighbours[z].dataset.path = parseInt(neighbours[z].dataset.path) + 10;
    };

    setAStarSumDistance(neighbours[z]);

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
      neighbour.dataset.path = shortestPathToCurrentNode(currentNode, neighbour) + 1;
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


const shortestPathToCurrentNode = (currentNode) => {
  const shortestPathToCurrentCell = currentNode.dataset.path;
  return parseInt(shortestPathToCurrentCell);
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

  return;
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
    pathDiv.classList.add('shortest-path-node');
    await addDelay('medium');
  };
};

/*
Notes from implementing a*:

The biggest challenge was in ultimately reaching the conclusion that the manhattan distance
is the best heuristic to use.
Originally, I went with euclidean distance but it quickly became clear that this is not a good
heuristic because movement in the grid is restriscted to horizontal and vertical motion; movement
cannot be diagonal. Thus, using euclidean distance as a heuristic would not always find the shortest
path and would sometimes explore unnecessary nodes.

Using the manhattan distance worked much better. To optimise it and make a* even more efficient,
I tried adding the euclidean distance to the manhattan distance for the heuristic value for each node.
This worked better in certain tests as it removed the limitation of using just the manhattan distance,
where every node in the same row (if travelling horizontal then vertically) has the same a* distance
because as the path increases by 1, the heuristic decreases by one.
This is of course only true for each node up until the path reaches the node in the same plane
as the target. That is, if we travelled horizontally first, the same column and vice versa if travelling
vertically first. For the node after the one in the same plane, both a* and the path increase by 1.

The reason that the manhattan distance setting the same a* value for all these nodes seems sub-optimal is that
if there is a wall or weight just in front of the target, it forces the algorithm to explore the paths
of all the nodes in the rows with the same a* value. This is true even when setting a tie breaker for
h(n) + g(n). Hence we see a rectangle in this scenario when the algo executes.

Adding the euclidean distance to the manhattan distance solves this scenario.

It also solves the scenario where there are two equally optimal paths to the target and using
just the manhattan distance as the heuristic forces the algorithm to find both paths rather than
just continuing along the one it discovered first.

However....

Setting the heuristic value as the euclidean distance plus the manhattan distance cannot always
guaratnee the shortest path.
Because...we prioritise visitation of nodes by g(n) + h(n) but at the same time, the action of
'visiting' a node (not 'discovering') is meant to guarantee that we are visiting that node
via the shortest path to it.
In certain scenarios, when there is a wall around the target, I found that at the point where
the algorithm visits the node closest to the target but next to the wall, it then discovers nodes
adjacent to this node (also next to the wall).

When it discovers them, it sets the 'aStar value' i.e. g(n) + h(n) for them.
In doing so, it calculates g(n) for them via the node that discovered them i.e. the one next to
the wall.

This g(n) value is in fact incorrect, as the shortest path to these nodes adjacent to the one
closest to the wall would have to come from the nodes directly above them since this involves
less turns.

At this point, these nodes adjacent to the one next to the wall end up having the lowest
g(n) + h(n) value (and not the nodes above them that would need to be visited next to
establish the shortest path to them).

Because they have the lowest g(n) + h(n) value, the algorithm places them to the front of the
priority queue for which node to visit next.

So they end up being visited despite not having the shortest path to them found.

The path to the target then ends up being found via these nodes, which means the path to the
target is not via the shortest path.

The key insight here is that using the euclidean distance plus the manhattan distance is considered
an 'inadmissable' heuristic because it overestimates the remaining distance from the node being
evaluated to the target.

The estimate from the node being evaluated to the target must always be less than or equal to
the true remaining distance from that node to the target for the heuristic to be admissible.
*/


/*
interesting scenario:

If there is a flag in the grid and several paths with the same cost of reaching the flag...
my a* implementation will always go down the first path it discovers to the flag.

The problem is that the first path to the flag does not always lead to the path with the least
cost from the start to the end via the flag. This is because of the rotational cost.

For example, if there are multiple paths from the start to the flag with a cost of 35..
and the first path (and hence chosen path) is one where we reach the flag facing left

Then, if the target is to the right of the flag, we have to do a 180 degree turn for the
shortest path startng from the flag to the target. This adds to the cost of the total path by 2.

However, it can be the case that another one of the multiple paths from the start to the flag
with a cost of 35 could reach it and be facing right when it does.
This is favorable for the path from the flag to the target as it measn we avoid the 180 degree
turn and save ourself the additional cost of two in the total cost.

Solution?
There are no solutions only tradeoffs....
You could evaluate all paths that lead to the flag which are equal to the shortest distance so
that the algorithm is not biased by the order in which is examines nodes

However...this of course means more processing before a path can be found, making the algorithm
overall less efficient. It depends whether the cost saving to the final path is worth it.
*/
