export function randomMaze(grid, startNode, finishNode) {
  let walls = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if ((startNode && (row === startNode.row && col === startNode.col))
       || (finishNode && (row === finishNode.row && col === finishNode.col))
      )
        continue;

      if (Math.random() < 0.33) {
        walls.push([row, col]);
      }
    }
  }
  walls.sort(() => Math.random() - 0.5);
  return walls;
}
