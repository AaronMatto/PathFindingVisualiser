/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

// do we only want to calculate the euclidean for the cell we are currently visiting or,
// do we want to pre-mptively calculate it for every cell in the grid?
// why does this matter? Because, at some point we have to compare the distance of the
// current cell to the final cell (X),
// to the ones next to it, to see which cell next to the current cell has the next smallest
// distance to the target. We then go to that cell.
// distance = current cell actual distance + cell euclidean distance
// proposal:
// - we know the location of the target and the current cell
// a function called calculatedDistance so that:
// - we calculate the euclidean of a cell (heuristic)
// - we caclulate its actual distance (i.e. no of steps) as we know where the target is (actual)
// - we add these together and we have our caclulatedDistance value returned

// call this function for each of the current cell's unvisited neighbours *
// - travel to the neighbour of the current cell with the lowest value for the *
// - caclulatedDistance function
// - repeat until target reached
//
// * this means excluding visited neighbours (blue sqs) and walls (black sqs)
// * if two neighbours equally share the shortest value for calculatedDistance:
//  e.g. a wall covering the height of the grid with only a gap at the top available
//  ...then we continue exploring in both directions, so we would travel to the
// above and below neighbours both in this situation. The algo continuing to search
// the upward neighbours will eventually detect a cell that has a right neighbour to travel to.
// At which point, it will start to search right only due to decreaing caclulateDistance values
// The algo that continued to search downward at the wall will never reach a cell that has a
// rightNeighbour available. It will have travelled one less or one more squares than the
// the algo that continued to search upward, based on whether the implementation biases
// its priority to a upward or downward neighbour from the current cell
// so the area that searched upward at the wall and the area that searched downward
// should be (area + 1) or (area - 1) the other

// why does the area form a diamond when there's a wall?
// you form a diamond on eevery iteration that hits the wall
// on that iteration we check all cells with that value for actual distance

// in one iteration if we hit the wall we must travel to all nodes from the start at the
// actual current distance, hence the diamond. do we calculate the euclidean?
// yes, it's not that expensive and for now i need to think about whether
// the shortest path could still end up being a path that has a larger euclidean
// than what the current iteration would prioritise
// If such a situation isn't possible, we wouldnt need to calculate the euclidean


export const aStarSearch = () => {
  console.log('g');
};
