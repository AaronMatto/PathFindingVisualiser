/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable require-jsdoc */
import {gridCells, startNodeSelect, targetNodeSelect} from './app.js';
export function dijkstra() {
  const clearBoardBtn = document.getElementById('clearBoardBtn');
  clearBoardBtn.addEventListener('click', (e) => {
    if (e.target == clearBoardBtn) {
      for (let i = 0; i < gridCells.length; i++) {
        gridCells[i].innerHTML = '';
        gridCells[i].className = '';
        gridCells[i].id = i;
        gridCells[i].classList.add('node');
      };
      for (const id in tracker) {
        delete tracker[id];
      };
      path.length = 0;
    };
  });

  // PLOTTING THE SHORTEST PATH
  const getCoord = (cell, z) => {
    return cell.getAttribute(`data-${z}`);
  };

  const tracker = {};
  const dijkstraAlgo = (startcell) => {
    const visited = [];
    let unvisited = [startcell];
    let iterations = 0;
    let target;
    let running = true;

    while (running == true) {
      const numberToVisit = unvisited.length;
      for (let i = 0; i < numberToVisit; i++) {
        const currentlyVisitedCell = unvisited[i];
        const currentlyVisitedNewNeighbours = findUnvisitedNeighbours(currentlyVisitedCell);

        if (Array.isArray(currentlyVisitedNewNeighbours) == false) {
          running = false;
          i = numberToVisit; // so that we don't perform this code > once, since the target can be the neigbour of more than one cell in the unvisited[] we are iterating over.
          target = currentlyVisitedNewNeighbours;
        }

        visited.push(currentlyVisitedCell);
        unvisited = unvisited.concat(currentlyVisitedNewNeighbours);
      };

      unvisited.splice(0, numberToVisit);
      // eslint-disable-next-line no-unused-vars
      iterations++;
    };
    calculatePath(tracker, target);
  };

  const visualiseBtn = document.getElementById('visualise-btn');
  visualiseBtn.parentElement.addEventListener('click', (e) => {
    let startCell;
    let targetCell;
    if (e.target == visualiseBtn.parentElement) {
      gridCells.forEach((gridcell) => {
        if (gridcell.innerHTML == targetNodeSelect) {
          targetCell = gridcell;
        }

        if (gridcell.innerHTML == startNodeSelect) {
          gridcell.classList.add('start');
          gridcell.id += ' start';
          startCell = gridcell;
        };
      });

      if (startCell == undefined || targetCell == undefined) { // May change later. Can we do this without knowing where the target is?
        alert('Please select both a start and end point');
        return;
      };

      dijkstraAlgo(startCell);
    };
  });

  // function to find unvisited neighbours
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
    const unvisitedNeighbours = [];

    for (let z = 0; z < neighbours.length; z++) {
      if (neighbours[z] == undefined) {
        continue;
      }

      if (neighbours[z].innerHTML == targetNodeSelect) {
        neighbours[z].classList.add('visited-node-1');
        updateTracker(currentCell, neighbours[z]);
        return neighbours[z].id;
      }

      if (neighbours[z].classList.contains('visited-node-1') ||
        neighbours[z].innerHTML === startNodeSelect) {
        continue;
      }

      neighbours[z].classList.add('visited-node-1');
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

  // function to calculate shortest path once target found
  const path = [];
  const calculatePath = (tracker, targetId) => {
    // eslint-disable-next-line no-unused-vars
    const rotations = 0;
    // scenarios:
    // if target x > start x, we know target is right of start
    // if target x < start x, target is left of start
    // if target y is > than start y, target is below start
    // if target y is < than start
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

  const showPath = (pathIdArray) => {
    for (let j = 0; j < pathIdArray.length; j++) {
      const pathDiv = document.getElementById(parseInt(pathIdArray[j]));
      pathDiv.classList.remove('visited-node-1');
      pathDiv.classList.add('shortest-path-node');
    };
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
