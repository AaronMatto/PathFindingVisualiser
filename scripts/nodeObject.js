/* eslint-disable */

class Node {
  constructor(x, y, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    let direction;
    let isStart = false;
    let isTarget = false;
    let isWall = false;
    let visited = false;
    let shortestPath = 1000;
    let previousNode;
  }

  // we only want to do this if the shortest path to this node is less than the one we currently have
  setDirection = (direction) => {
    this.direction = direction;
  }
  // we should not need this if the discovery of neighbours from a current cell is dictated by the number of iterations
  // same for previous node below.

  // we want to do this when we discover a path to this node and update this if we discover a shorter path to it
  setPreviousNode = (idOfPrevNode) => {
    this.previousNode = idOfPrevNode;
  }

  setStart = () => {
    this.isStart = true;
    this.direction = 'R';
  }

  setTarget = () => {
    this.isTarget = true;
  }

}

export default Node;
