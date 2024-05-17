/* eslint-disable padded-blocks */
/* eslint-disable max-len */

import {gridCells, targetNodeSelect, bombNodeSelect, addDelay, path} from '../app.js';


export const recursiveDivision = async (yEnd, yStart, xEnd, xStart) => {
// excluded: any coords of already existing walls, gaps, or row/col either side of an exisiting wall
  const excludedHorizontalCoords = [];
  const excludedVerticalCoords = [];

  let horizontalWallCoord = getRandomCoord(17, 2);
  let verticalWallCoord = getRandomCoord(57, 2);

  // base condition

  // only on first iteration
  await createPerimeter();

  // every iteration
  await createWalls(verticalWallCoord, horizontalWallCoord);

  addGapsInVerticalWall(horizontalWallCoord, verticalWallCoord);

  addGapInHorizontalWall(initialHorizontalWallCoord, initialVerticalWallCoord);

  // call function again
};


const createPerimeter = async () => {
  let perimeter = [];

  const LeftXBorder = Array.from(document.querySelectorAll('[data-x="0"]'));
  const RightXBorder = Array.from(document.querySelectorAll('[data-x="59"]'));
  const TopYBorder = Array.from(document.querySelectorAll('[data-y="0"]'));
  const BottomYBorder = Array.from(document.querySelectorAll('[data-y="19"]'));

  perimeter = perimeter.concat(TopYBorder, RightXBorder, LeftXBorder, BottomYBorder);

  for (let i = 0; i < perimeter.length; i++) {

    if (perimeter[i].innerHTML == '') {
      perimeter[i].classList.add('wall-node');
    };

    await addDelay('maze');
  };
};

const createWalls = async (randomX, randomY) => {
  await horizontalSplit(randomY);
  await verticalSplit(randomX);
};


const getRandomCoord = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


const horizontalSplit = async (randomYCoord) => {
  const randomRowCells = createArrayFromRowOrColumn('y', randomYCoord);

  for (let i = 0; i < randomRowCells.length; i++) {
    if (randomRowCells[i].innerHTML == '') {
      randomRowCells[i].classList.add('wall-node');
    };
    await addDelay('maze');
  };

};

const verticalSplit = async (randomXCoord) => {
  const randomColCells = createArrayFromRowOrColumn('x', randomXCoord);

  for (let i = 0; i < randomColCells.length; i++) {
    if (randomColCells[i].innerHTML == '') {
      randomColCells[i].classList.add('wall-node');
    };
    await addDelay('maze');
  };
};


const addGapsInVerticalWall = (horizontalWallCoord, verticalWallCoord) => {
  const topGap = getRandomCoord(horizontalWallCoord - 1, 1);

  const bottomGap = getRandomCoord(18, horizontalWallCoord + 1);

  const verticalWall = createArrayFromRowOrColumn('x', verticalWallCoord);

  for (let i = 0; i < verticalWall.length; i++) {
    if (verticalWall[i].dataset.y == topGap || verticalWall[i].dataset.y == bottomGap) {
      verticalWall[i].classList.remove('wall-node');
    };
  };

  return [topGap, bottomGap];
};

const addGapInHorizontalWall = (horizontalWallCoord, verticalWallCoord) => {
  let gap;

  if (Math.random() > 0.49) {
    gap = getRandomCoord(verticalWallCoord - 1, 1);
  } else {
    gap = getRandomCoord(58, verticalWallCoord + 1);
  }

  const horizontalWall = createArrayFromRowOrColumn('y', horizontalWallCoord);

  for (let i = 0; i < horizontalWall.length; i++) {
    if (horizontalWall[i].dataset.x == gap) {
      horizontalWall[i].classList.remove('wall-node');
    };
  };

  return gap;
};

const createArrayFromRowOrColumn = (xOrY, coord) => {
  return Array.from(document.querySelectorAll(`[data-${xOrY}="${coord}"]`));
};
