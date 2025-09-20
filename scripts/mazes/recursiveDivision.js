/* eslint-disable padded-blocks */
/* eslint-disable max-len */

import {gridCells, targetNodeSelect, bombNodeSelect, addDelay, path} from '../app.js';

let wallCounter = 0;

const xLowerBoundary = 1;
const xHigherBoundary = 58;
const yLowerBoundary = 1;
const yHigherBoundary = 18;
const yBoundaries = [0, 19]

export const recursiveDivision = async (yEnd, yStart, xEnd, xStart) => {

  createVerticalWall();

  // base condition


  // every iteration




  // call function again
};





const createVerticalWall = () => {

  // random x coord between 2 and 57
  var startPointX = randomPoint(2, 58);

  var wallDivs = Array.from(document.querySelectorAll(`[data-x='${startPointX}']`));


  wallDivs.forEach(wallDiv => {

    var validExtensionPoints = []

    var validationResult = validateVerticalWallSegment(wallDiv);

    if (validationResult == true) {
      validExtensionPoints.add(wall);
    };

    if (validExtensionPoints.length == 0) {
      // no valid w
    }

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

const validateVerticalWallSegment = (currentCell) => {


    var currentX = currentCell.getAttribute('data-x');
    var currentY = currentCell.getAttribute('data-y');

    var leftNeighbour = findNeighbour(currentX, currentY, 0, 1);
    var rightNeighbour =  findNeighbour(currentX, currentY, 0, -1);

    var cellTwoToLeft = findNeighbour(currentX, currentY, 0, 2);
    var cellTwoToRight = findNeighbour(currentX, currentY, 0, -2);

    var canExtendLeft = false;
    var canExtendRight = false;

    if (leftNeighbour.classList.contains('wall-node') == false 
    && cellTwoToLeft.classList.contains('wall-node') == false
    && yBoundaries.includes(currentY) == false) {
      // valid extension point for left
      canExtendLeft = true;
    };

    if (rightNeighbour.classList.contains('wall-node') == false 
    && cellTwoToRight.classList.contains('wall-node') == false
    && yBoundaries.includes(currentY) == false) {
      // valid extension point for right
      canExtendRight = true;
    };
    
    if (canExtendLeft == false && canExtendRight == false) {
      // invalid extension point on the current wall being added.
      return false;
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

// if current wall extends into another wall:
// - the wall that is extended into will have an id (key) and that will will have a list of valid extension points (value).
// The extension point will be removed from the list since the current wall has extended into it
// - extension points on the current wall cannot be within 2 squares of the wall the current wall extended from AND
// the wall extended into