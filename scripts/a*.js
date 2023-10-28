/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

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

    we go to the right neigbour again...but h(n) no longer favors right neighbour, g(n) still does

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


export const aStarSearch = () => {
  console.log('g');
};
