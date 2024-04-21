/* eslint-disable padded-blocks */
/* eslint-disable max-len */

import {gridCells, targetNodeSelect, bombNodeSelect, addDelay, path} from '../app.js';


export const recursiveDivision = async () => {

  await createPerimeter();

  await split();

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

const split = async () => {

  const randomYCoord = getRandomCoord(17, 2);
  const randomXCoord = getRandomCoord(57, 2);

  await horizontalSplit(randomYCoord);

  await verticalSplit(randomXCoord);

  addGaps(randomXCoord, randomYCoord);

};


const getRandomCoord = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


const horizontalSplit = async (randomYCoord) => {

  const randomRowCells = Array.from(document.querySelectorAll(`[data-y="${randomYCoord}"]`));

  for (let i = 0; i < randomRowCells.length; i++) {
    if (randomRowCells[i].innerHTML == '') {
      randomRowCells[i].classList.add('wall-node');
    };
    await addDelay('maze');
  };

};

const verticalSplit = async (randomXCoord) => {
  const randomColCells = Array.from(document.querySelectorAll(`[data-x="${randomXCoord}"]`));

  for (let i = 0; i < randomColCells.length; i++) {
    if (randomColCells[i].innerHTML == '') {
      randomColCells[i].classList.add('wall-node');
    };
    await addDelay('maze');
  };
};


const addGaps = (horizontalSplitCoord, verticalSplitCoord) => {


};
