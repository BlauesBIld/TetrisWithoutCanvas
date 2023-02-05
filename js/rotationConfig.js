/***
 * When a tile is rotated, 5 different positions are tested to see if the tile can fit in that position after roatiting it.
 * If no position is possible the whole rotation gets cancelled.
 * The first test is the basic rotation and the next 4 tests are the position added by the underneath values.
 */

rotationChecks = {
    "0.1": [[-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "1.0": [[1, 0], [1, -1], [0, 2], [1, 2]],
    "1.2": [[1, 0], [1, -1], [0, 2], [1, 2]],
    "2.1": [[-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "2.3": [[1, 0], [1, 1], [0, -2], [1, -2]],
    "3.2": [[-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "3.0": [[-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "0.3": [[1, 0], [1, 1], [0, -2], [1, -2]]
}

rotationChecksForI = {
    "0.1": [[-2, 0], [1, 0], [-2, 1], [1, 2]],
    "1.0": [[2, 0], [-1, 0], [2, 1], [-1, -2]],
    "1.2": [[-1, 0], [2, 0], [-1, 2], [2, -1]],
    "2.1": [[1, 0], [-2, 0], [1, 2], [-2, 1]],
    "2.3": [[2, 0], [-1, 0], [2, 1], [-1, -2]],
    "3.2": [[-2, 0], [1, 0], [-2, -1], [1, 2]],
    "3.0": [[1, 0], [-2, 0], [1, -2], [-2, 1]],
    "0.3": [[-1, 0], [2, 0], [-1, 2], [2, -1]]
}