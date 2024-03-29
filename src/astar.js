export function astar(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  let unvisitedNodes = []; //open list
  let visitedNodesInOrder = []; //closed list

  startNode.distance = 0;
  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length !== 0) {
    unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
    let closestNode = unvisitedNodes.shift();
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) return visitedNodesInOrder;

    let neighbours = getNeighbours(closestNode, grid);

    for (let neighbour of neighbours) {
      let distance = closestNode.distance + 1;
      //f(n) = g(n) + h(n)
      if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
        
        unvisitedNodes.unshift(neighbour);
        neighbour.distance = distance;
        neighbour.totalDistance =
          distance + manhattanDistance(neighbour, finishNode) + neighbour.isRisky * 5;
        neighbour.previousNode = closestNode;
      } else if (distance < neighbour.distance) {
        neighbour.distance = distance;
        neighbour.totalDistance =
          distance + manhattanDistance(neighbour, finishNode);
        neighbour.previousNode = closestNode;
      }
    }
  }
  return visitedNodesInOrder;
}
function getNeighbours(node, grid) {
  let neighbours = [];
  let { row, col } = node;
  // right
  if (col !== grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  // down
  if (row !== grid.length - 1) neighbours.push(grid[row + 1][col]);
  // left
  if (col !== 0) neighbours.push(grid[row][col - 1]);
  // up
  if (row !== 0) neighbours.push(grid[row - 1][col]);

  // right-up
  if (col !== grid[0].length - 1 && row !== 0 ) neighbours.push(grid[row - 1][col + 1]);
  // right-down
  if (col !== grid[0].length - 1 && row !== grid.length - 1) neighbours.push(grid[row + 1][col + 1]);
  // left-up
  if (col !== 0 && row !== 0) neighbours.push(grid[row - 1][col - 1]);
   // left-down
   if (col !== 0 && row !== grid.length - 1) neighbours.push(grid[row + 1][col - 1]);

  return neighbours.filter(
    (neighbour) => !neighbour.isWall && !neighbour.isVisited
  );
}

function neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes) {
  for (let node of unvisitedNodes) {
    if (node.row === neighbour.row && node.col === neighbour.col) {
      return false;
    }
  }
  return true;
}

function manhattanDistance(node, finishNode) {
  let x = Math.abs(node.row - finishNode.row);
  let y = Math.abs(node.col - finishNode.col);

  return x + y;
}

export function getNodesInShortestPathOrderAstar(finishNode) {
  let nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
