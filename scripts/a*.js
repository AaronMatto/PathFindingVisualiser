/* eslint-disable require-jsdoc */

import { gridCells } from "./app";

class Node {
  constructor(x, y, i, euclidean) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.euclidean = euclidean;
  }


}

const getCoord = (cell, z) => {
  return cell.getAttribute(`data-${z}`);
};

const = calculateEuclidean => (currentCell, targetCell) {
}
