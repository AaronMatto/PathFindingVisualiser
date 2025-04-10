/* eslint-disable padded-blocks */
/* eslint-disable max-len */

import {gridCells, targetNodeSelect, bombNodeSelect, addDelay, path} from '../app.js';

let wallCounter = 0;

const xLowerBoundary = 1;
const xHigherBoundary = 58;
const yLowerBoundary = 1;
const yHigherBoundary = 18;

export const recursiveDivision = async (yEnd, yStart, xEnd, xStart) => {

  createVerticalWall();

  // base condition


  // every iteration




  // call function again
};





const createVerticalWall = () => {

  // random x coord between 2 and 57

  var startPointX = randomPoint(2, 57);

  var wallDivs = Array.from(document.querySelectorAll(`[data-x='${startPointX}']`));


  wallDivs.forEach(wall => {


    var validationResult = validateWallSegment(wall, true);

    if (validationResult == true) {
      wall.classList.add('wall-node');
    };

  });

  // draw wall all the way down

  // set a wall id

  // add random gap between y = 0 and y = 19

  // create list of valid extension points. For an extension point to be valid it must have at least 2 squares free
  // in either direction. Each extension point must maintain which directions it can validly extend into 
  // (R/L) in this case. The random gap cannot be a valid extension point.

  // add the wall to the dictionary. The key is the wall id and the value is the list of valid extension points.




};


const randomPoint = (inclusiveStart, exclusiveEnd) => {
  return Math.floor(Math.random() * (exclusiveEnd)) + inclusiveStart;
};

const validateWallSegment = (currentCell, isVertical) => {

  if (isVertical) {

    var currentX = currentCell.getAttribute('data-x');
    var currentY = currentCell.getAttribute('data-y');

    var leftNeighbour = findNeighbour(currentX, currentY, 0, 1);
    var rightNeighbour =  findNeighbour(currentX, currentY, 0, -1);

    var cellTwoToLeft = findNeighbour(currentX, currentY, 0, 2);
    var cellTwoToRight = findNeighbour(currentX, currentY, 0, -2);

    var canExtendLeft = false;
    var canExtendRight = false;

    if (leftNeighbour.classList.contains('wall-node') == false && cellTwoToLeft.classList.contains('wall-node') == false) {
      // valid extension point for left
      canExtendLeft = true;
    };

    if (rightNeighbour.classList.contains('wall-node') == false && cellTwoToRight.classList.contains('wall-node') == false) {
      // valid extension point for right
      canExtendRight = true;
    };
    
    if (canExtendLeft == false && canExtendRight == false) {
      // invalid extension point on the current wall being added.
      return false;
    };


  };



};

const getCoord = (cell, xOrY) => {
  const coord = cell.getAttribute(`data-${xOrY}`);
  return parseInt(coord);
};

const findNeighbour = (currentX, currentY, ySubtrahend, xSubtrahend) => {
  const neighbour = gridCells.find((cell) => parseInt(getCoord(cell, 'y')) == currentY - ySubtrahend &&
    parseInt(getCoord(cell, 'x')) == currentX - xSubtrahend);
  return neighbour;
};


class VerticalWall {

  constructor(yStart, yEnd, validExtensionPoints ) {
    this.yStart = yStart
    this.yEnd = yEnd
    this.validExtensionPoints = validExtensionPoints
    this.Id = wallCounter++;
    
  };



};


class HorizontalWall {


  constructor(xStart, ) {

    this.xStart = 
    this.xEnd
    this.validExtensionPoints = []
    this.Id = wallCounter++;
    
  };



};


class ExtensionPoint {

  // if an extensionpoint is not valid at all, it shouldnt list in the wall's list of valid extension points.

  constructor(isValidLeft, isValidRight) {

    
  }

}

