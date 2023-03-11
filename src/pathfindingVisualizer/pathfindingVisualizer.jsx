import React, { useState, useEffect } from "react";
import "./pathfindingVisualizer.css";
import Node from "./Node/node";
import NavBar from "./navbar";

import {
  astar,
  getNodesInShortestPathOrderAstar,
} from "../pathfindingAlgorithms/astar";
import factoryMaze from "../mazeAlgorithms/factoryMaze";

const initialNum = getInitialNum(window.innerWidth, window.innerHeight);
const initialNumRows = initialNum[0];
const initialNumColumns = initialNum[1];

const startFinishNode = getStartFinishNode(initialNumRows, initialNumColumns);
const startNodeRow = startFinishNode[0];
const startNodeCol = startFinishNode[1];
const finishNodeRow = startFinishNode[2];
const finishNodeCol = startFinishNode[3];



export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [visualizingAlgorithm, setVisualizingAlgorithm] = useState(false);
  const [generatingMaze, setGeneratingMaze] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [numRows, setNumRows] = useState(initialNumRows);
  const [numColumns, setNumColumns] = useState(initialNumColumns);
  const [speed, setSpeed] = useState(10);
  const [mazeSpeed, setMazeSpeed] = useState(10);
  const [isSettingWalls, setIsSettingWalls] = useState(true);
  const [waypointList, setWaypointList] = useState([]);

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    const grid = getInitialGrid(numRows, numColumns);
    if(isSettingWalls)
    setGrid(grid);
  }, [])

  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const updateSpeed = (path, maze) => {
    setSpeed(path);
    setMazeSpeed(maze);
  };

  const updateNodeType = (type) => {
    setIsSettingWalls(type === "Wall");
  }

  const handleMouseDown = (row, col) => {
    console.log(waypointList);
    const {newGrid, newWaypointList } = isSettingWalls ? getNewGridWithWalls(grid, waypointList, row, col) : getNewGridWithWaypoint(grid, waypointList, row, col);

    console.log(newWaypointList);

    setGrid(newGrid);
    setWaypointList(newWaypointList);
    setMouseIsPressed(true);
  }

  const handleMouseEnter = (row, col) => {
    if (mouseIsPressed) {
      const {newGrid, newWaypointList } = isSettingWalls ? getNewGridWithWalls(grid, waypointList, row, col) : getNewGridWithWaypoint(grid, waypointList, row, col);

      setGrid(newGrid);
      setWaypointList(newWaypointList);
      setMouseIsPressed(true);
    }
  }

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  }

  const clearGrid = () => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          !(
            (row === startNodeRow && col === startNodeCol) ||
            (row === finishNodeRow && col === finishNodeCol)
          )
        ) {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const newGrid = getInitialGrid(numRows, numColumns);

    setGrid(newGrid);
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  }

  const clearPath = () => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (
          document.getElementById(`node-${row}-${col}`).className ===
          "node node-shortest-path"
        ) {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const newGrid = getGridWithoutPath(grid);

    setGrid(newGrid);
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  }

  const animateShortestPath = (nodesInShortestPathOrder, visitedNodesInOrder) => {
    if (nodesInShortestPathOrder.length === 1)
      setVisualizingAlgorithm(false);
    for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
      if (i === nodesInShortestPathOrder.length - 1) {
        setTimeout(() => {
          let newGrid = updateNodesForRender(
            grid,
            nodesInShortestPathOrder,
            visitedNodesInOrder
          );
          setGrid(newGrid);
          setVisualizingAlgorithm(false);
        }, i * (3 * speed));
        return;
      }
      let node = nodesInShortestPathOrder[i];
      setTimeout(() => {
        //shortest path node
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, i * (3 * speed));
    }
  };

  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    let newGrid = grid.slice();
    for (let row of newGrid) {
      for (let node of row) {
        let newNode = {
          ...node,
          isVisited: false,
        };
        newGrid[node.row][node.col] = newNode;
      }
    }
    setGrid(newGrid);
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      let node = visitedNodesInOrder[i];
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(
            nodesInShortestPathOrder,
            visitedNodesInOrder
          );
        }, i * speed);
        return;
      }
      setTimeout(() => {
        //visited node
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, i * speed);
    }
  };

  const visualizeAStar = () => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    setVisualizingAlgorithm(true)
    setTimeout(() => {
      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];
      const visitedNodesInOrder = astar(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(
        finishNode
      );
      animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }, speed);
  }

  const animateMaze = (walls) => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          let newGrid = getNewGridWithMaze(getInitialGrid(numRows, numColumns), walls);
          setGrid(newGrid);
          setGeneratingMaze(false);
        }, i * mazeSpeed);
        return;
      }
      let wall = walls[i];
      let node = grid[wall[0]][wall[1]];
      setTimeout(() => {
        //Walls
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-wall-animated";
      }, i * mazeSpeed);
    }
  };

  const generateMaze = (maze) => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    setGeneratingMaze(true);
    setTimeout(() => {
      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];
      const walls = factoryMaze(maze)(grid, startNode, finishNode);
      animateMaze(walls);
    }, mazeSpeed);
  }


  return (
    <>
       <NavBar
              visualizingAlgorithm={visualizingAlgorithm}
              generatingMaze={generatingMaze}
              visualizeAStar={visualizeAStar}
              generateMaze={generateMaze}
              clearGrid={clearGrid}
              clearPath={clearPath}
              updateSpeed={updateSpeed}
              updateNodeType = {updateNodeType}
      />
      <div
        className={`grid ${visualizingAlgorithm || generatingMaze ? "pe-none":"pe-auto"} `}
      >
        {grid.map((row, rowId) => {
          return (
            <div key={rowId}>
              {row.map((node, nodeId) => {
                const {
                  row,
                  col,
                  isStart,
                  isFinish,
                  isVisited,
                  isShortest,
                  isWall,
                  isWaypoint
                } = node;
                return (
                  <Node
                    key={nodeId}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isFinish={isFinish}
                    isVisited={isVisited}
                    isShortest={isShortest}
                    isWall={isWall}
                    isWaypoint={isWaypoint}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) =>
                      handleMouseEnter(row, col)
                    }
                    onMouseUp={() => handleMouseUp()}
                    width={width}
                    height={height}
                    numRows={numRows}
                    numColumns={numColumns}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );

}

function getInitialNum(width, height) {
  let numColumns;
  if (width > 1500) {
    numColumns = Math.floor(width / 25);
  } else if (width > 1250) {
    numColumns = Math.floor(width / 22.5);
  } else if (width > 1000) {
    numColumns = Math.floor(width / 20);
  } else if (width > 750) {
    numColumns = Math.floor(width / 17.5);
  } else if (width > 500) {
    numColumns = Math.floor(width / 15);
  } else if (width > 250) {
    numColumns = Math.floor(width / 12.5);
  } else if (width > 0) {
    numColumns = Math.floor(width / 10);
  }
  let cellWidth = Math.floor(width / numColumns);
  let numRows = Math.floor(height / cellWidth);
  return [numRows, numColumns];

}

function getRandomNums(num) {
  let randomNums1 = [];
  let temp = 2;
  for (let i = 5; i < num / 2; i += 2) {
    randomNums1.push(temp);
    temp += 2;
  }
  let randomNums2 = [];
  temp = -2;
  for (let i = num / 2; i < num - 5; i += 2) {
    randomNums2.push(temp);
    temp -= 2;
  }
  return [randomNums1, randomNums2];
}

function getStartFinishNode(numRows, numColumns) {
  let randomNums;
  let x;
  let y;
  let startNodeRow;
  let startNodeCol;
  let finishNodeRow;
  let finishNodeCol;
  if (numRows < numColumns) {
    randomNums = getRandomNums(numRows);
    x = Math.floor(numRows / 2);
    y = Math.floor(numColumns / 4);
    if (x % 2 !== 0) x -= 1;
    if (y % 2 !== 0) y += 1;
    startNodeRow =
      x + randomNums[1][Math.floor(Math.random() * randomNums[1].length)];
    startNodeCol = y + [-6, -4, -2, 0][Math.floor(Math.random() * 4)];
    finishNodeRow =
      x + randomNums[0][Math.floor(Math.random() * randomNums[0].length)];
    finishNodeCol =
      numColumns - y + [0, 2, 4, 6][Math.floor(Math.random() * 4)];
  } else {
    randomNums = getRandomNums(numColumns);
    x = Math.floor(numRows / 4);
    y = Math.floor(numColumns / 2);
    if (x % 2 !== 0) x -= 1;
    if (y % 2 !== 0) y += 1;
    startNodeRow = x + [-6, -4, -2, 0][Math.floor(Math.random() * 4)];
    startNodeCol =
      y + randomNums[1][Math.floor(Math.random() * randomNums[1].length)];
    finishNodeRow = numRows - x + [0, 2, 4, 6][Math.floor(Math.random() * 4)];
    finishNodeCol =
      y + randomNums[0][Math.floor(Math.random() * randomNums[0].length)];
  }
  return [startNodeRow, startNodeCol, finishNodeRow, finishNodeCol];
}

const getInitialGrid = (numRows, numColumns) => {
  let grid = [];
  for (let row = 0; row < numRows; row++) {
    let currentRow = [];
    for (let col = 0; col < numColumns; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === startNodeRow && col === startNodeCol,
    isFinish: row === finishNodeRow && col === finishNodeCol,
    distance: Infinity,
    totalDistance: Infinity,
    isVisited: false,
    isShortest: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWalls = (grid, waypointList, row, col) => {
  let newWaypointList = waypointList;
  let newGrid = grid.slice();
  let node = grid[row][col];
  let newNode = {
    ...node,
    isWall: !node.isWall,
    isWaypoint: false
  };
  newGrid[row][col] = newNode;
  return { newGrid, newWaypointList };
};

const getNewGridWithWaypoint = (grid, waypointList, row, col) => {
  let newWaypointList = waypointList;
  let newGrid = grid.slice();
  let node = grid[row][col];
  let newNode = {
    ...node,
    isWall: false,
    isWaypoint: !node.isWaypoint
  };
  newGrid[row][col] = newNode;

  if(newNode.isWaypoint)
    newWaypointList = [...newWaypointList, newNode];
  else
    newWaypointList = newWaypointList.filter(node => node.row !== row && node.col !== col);

  return { newGrid, newWaypointList };
};

const getNewGridWithMaze = (grid, walls) => {
  let newGrid = grid.slice();
  for (let wall of walls) {
    let node = grid[wall[0]][wall[1]];
    let newNode = {
      ...node,
      isWall: true,
    };
    newGrid[wall[0]][wall[1]] = newNode;
  }
  return newGrid;
};

const getGridWithoutPath = (grid) => {
  let newGrid = grid.slice();
  for (let row of grid) {
    for (let node of row) {
      let newNode = {
        ...node,
        distance: Infinity,
        totalDistance: Infinity,
        isVisited: false,
        isShortest: false,
        previousNode: null,
      };
      newGrid[node.row][node.col] = newNode;
    }
  }
  return newGrid;
};

const updateNodesForRender = (
  grid,
  nodesInShortestPathOrder,
  visitedNodesInOrder
) => {
  let newGrid = grid.slice();
  for (let node of visitedNodesInOrder) {
    if (
      (node.row === startNodeRow && node.col === startNodeCol) ||
      (node.row === finishNodeRow && node.col === finishNodeCol)
    )
      continue;
    let newNode = {
      ...node,
      isVisited: true,
    };
    newGrid[node.row][node.col] = newNode;
  }
  for (let node of nodesInShortestPathOrder) {
    if (node.row === finishNodeRow && node.col === finishNodeCol) {
      return newGrid;
    }
    let newNode = {
      ...node,
      isVisited: false,
      isShortest: true,
    };
    newGrid[node.row][node.col] = newNode;
  }
};
