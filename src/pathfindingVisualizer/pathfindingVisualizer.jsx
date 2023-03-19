import React, { useState, useEffect } from "react";
import "./pathfindingVisualizer.css";
import Node from "./Node/node";
import NavBar from "./navbar";

import {
  astar,
  getNodesInShortestPathOrderAstar,
} from "../astar";
import factoryMaze from "../mazeAlgorithms/factoryMaze";

const initialNum = getInitialNum(window.innerWidth, window.innerHeight);
const initialNumRows = initialNum[0];
const initialNumColumns = initialNum[1];

// const startFinishNode = getStartFinishNode(initialNumRows, initialNumColumns);
let startNode;
let finishNode;

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [visualizingAlgorithm, setVisualizingAlgorithm] = useState(false);
  const [generatingMaze, setGeneratingMaze] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [numRows, setNumRows] = useState(initialNumRows);
  const [numColumns, setNumColumns] = useState(initialNumColumns);
  const [nodeType, setNodeType] = useState("Wall");
  const [waypointList, setWaypointList] = useState([]);

  useEffect(() => {
    setGrid(resetGrid(numRows, numColumns));
  }, [numRows, numColumns])
  
  const updateDimensions = () => {
    let [rows, cols] = getInitialNum(window.innerWidth, window.innerHeight);
    setNumRows(rows);
    setNumColumns(cols);
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
 
  window.addEventListener("resize", updateDimensions);

  const updateNodeType = (type) => {
    setNodeType(type);
  }

  const updateNodeSF = (type) => {
    setNodeType(type);
  }
  const handleMouseDown = (row, col) => {
    const {newGrid, newWaypointList } = getNewGridWithNewNode(grid, waypointList, row, col, nodeType, clearPath);


    setGrid(newGrid);
    setWaypointList(newWaypointList);
    setMouseIsPressed(true);
  }

  const handleMouseEnter = (row, col) => {
    if (mouseIsPressed) {
      const {newGrid, newWaypointList } = getNewGridWithNewNode(grid, waypointList, row, col, nodeType, clearPath);

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

    const newGrid = resetGrid(numRows, numColumns);

    setGrid(newGrid);
    setWaypointList([]);
    setVisualizingAlgorithm(false);
    setGeneratingMaze(false);
  }

  const clearPath = () => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
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
        let newGrid = updateNodesForRender(
          grid,
          nodesInShortestPathOrder,
          visitedNodesInOrder
        );
        setGrid(newGrid);
        setVisualizingAlgorithm(false);

        return;
      }
      let node = nodesInShortestPathOrder[i];
      node.isShortest = true;

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
        animateShortestPath(
          nodesInShortestPathOrder,
          visitedNodesInOrder
        );
        // setTimeout(() => {
        //   animateShortestPath(
        //     nodesInShortestPathOrder,
        //     visitedNodesInOrder
        //   );
        // }, i * speed);
        return;
      }
      node.isVisited = true;
    }
  };

  const visualizeAStar = () => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    let exitAlgorithm = false;

    setVisualizingAlgorithm(true)

    let currentStartNode = startNode;
    const finalWaypointList = [...waypointList, finishNode];

    finalWaypointList.forEach(waypoint => {
      if(exitAlgorithm)
        return;

      const tempGrid = grid.map(row => row.reduce((result, node) => [...result, JSON.parse(JSON.stringify(node))], []))
      const tempWaypoint = tempGrid[waypoint.row][waypoint.col];
      const tempCurrentNode = tempGrid[currentStartNode.row][currentStartNode.col];
      tempCurrentNode.isVisited = true;

      const visitedNodesInOrder = astar(tempGrid, tempCurrentNode, tempWaypoint);
      const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(
        tempWaypoint
      );

      if(!visitedNodesInOrder.find(node => node.row === waypoint.row && node.col === waypoint.col))
      {
        alert("No se ha encontrado un camino a alguno de los waypoints o a la meta");
        exitAlgorithm = true;
        return;
      }

      animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);

      currentStartNode = waypoint;
    });

    if(exitAlgorithm)
      {
        setVisualizingAlgorithm(false);
      }
  }

  const animateMaze = (walls) => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        let newGrid = getNewGridWithMaze(getInitialGrid(numRows, numColumns), walls);
        setGrid(newGrid);
        setGeneratingMaze(false);
      }
    }
  };

  const generateMaze = (maze) => {
    if (visualizingAlgorithm || generatingMaze) {
      return;
    }
    setGeneratingMaze(true);
    // const startNode = grid[startNodeRow][startNodeCol];
    // const finishNode = grid[finishNodeRow][finishNodeCol];
   
    const walls = factoryMaze(maze)(grid, startNode, finishNode);

    animateMaze(walls);
    // setTimeout(() => {
    //   const startNode = grid[startNodeRow][startNodeCol];
    //   const finishNode = grid[finishNodeRow][finishNodeCol];
    //   const walls = factoryMaze(maze)(grid, startNode, finishNode);
    //   animateMaze(walls);
    // }, mazeSpeed);
  }
  const isStartFinish = () =>{
    return  !startNode || !finishNode;
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
              updateNodeType = {updateNodeType}
              updateNodeSF = {updateNodeSF}
              numColumns = {numColumns}
              numRows = {numRows}
              setNumColumns = {setNumColumns}
              setNumRows = {setNumRows}
              isStartFinish = {isStartFinish}
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
                  isWaypoint,
                  isRisky
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
                    isRisky={isRisky}
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
const getInitialGrid = (numRows, numColumns) => {
  let grid = [];
  for (let row = 0; row < numRows; row++) {
    let currentRow = [];
    for (let col = 0; col < numColumns; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  if(startNode)
    grid[startNode.row][startNode.col] = startNode;
  if(finishNode)
    grid[finishNode.row][finishNode.col] = finishNode;
  return grid;
};
const resetGrid = (numRows, numColumns) => {
  let grid = [];
  for (let row = 0; row < numRows; row++) {
    let currentRow = [];
    for (let col = 0; col < numColumns; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  startNode = null;
  finishNode = null;
  return grid;
}
const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    totalDistance: Infinity,
    isVisited: false,
    isShortest: false,
    isWall: false,
    isWaypoint: false,
    isRisky: false,
    previousNode: null,
  };
};

const getNewGridWithNewNode = (grid, waypointList, row, col, type, clearPath) => {
  clearPath();
  switch (type) {
    case 'Wall':
      return getNewGridWithWalls(grid, waypointList, row, col);
    case 'Waypoint':
     return getNewGridWithWaypoint(grid, waypointList, row, col);
    case 'Start':
     return getNewGridWithStart(grid, waypointList, row, col);
    case 'Finish':
      return getNewGridWithFinish(grid, waypointList, row, col);
    case 'Risky':
      return getNewGridWithRisky(grid, waypointList, row, col);
    default:
      break;
  }

}
const getNewGridWithWalls = (grid, waypointList, row, col) => {
  let newWaypointList = waypointList;
  let newGrid = grid.slice();
  let node = grid[row][col];
  let newNode = {
    ...node,
    isStart: false,
    isFinish: false,
    isWall: !node.isWall,
    isWaypoint: false,
    isRisky: false
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
    isStart: false,
    isFinish: false,
    isWall: false,
    isWaypoint: !node.isWaypoint,
    isRisky: false
  };
  newGrid[row][col] = newNode;

  if(newNode.isWaypoint)
    newWaypointList = [...newWaypointList, newNode];
  else
    newWaypointList = newWaypointList.filter(node => node.row !== row && node.col !== col);

  return { newGrid, newWaypointList };
};

const getNewGridWithStart = (grid, waypointList, row, col) => {
  let newWaypointList = waypointList;
  let newGrid = grid.slice();
  if(startNode)
    newGrid[startNode.row][startNode.col].isStart = false;
  startNode = {
    row,
    col,
    isStart: true,
    isFinish: false,
    distance: Infinity,
    totalDistance: Infinity,
    isVisited: false,
    isShortest: false,
    isWall: false,
    isRisky: false,
    previousNode: null,
  };
  newGrid[row][col] = startNode;

  return { newGrid, newWaypointList };
};

const getNewGridWithFinish = (grid, waypointList, row, col) => {
  let newWaypointList = waypointList;
  let newGrid = grid.slice();
  if(finishNode)
    newGrid[finishNode.row][finishNode.col].isFinish = false;
  finishNode = {
    row,
    col,
    isStart: false,
    isFinish: true,
    distance: Infinity,
    totalDistance: Infinity,
    isVisited: false,
    isShortest: false,
    isRisky: false,
    isWall: false,
    previousNode: null,
  };
  newGrid[row][col] = finishNode;


  return { newGrid, newWaypointList };
};


const getNewGridWithRisky = (grid, waypointList, row, col) => {
  let newWaypointList = waypointList;
  let newGrid = grid.slice();
  let node = grid[row][col];
  let newNode = {
    ...node,
    isStart: false,
    isFinish: false,
    isWall: false,
    isWaypoint: false,
    isRisky: !node.isRisky
  };
  newGrid[row][col] = newNode;
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
  visitedNodesInOrder,
) => {
  let newGrid = grid.slice();
  for (let node of visitedNodesInOrder) {
    if (
      (startNode && finishNode) &&(
      (node.row === startNode.row && node.col === startNode.col) ||
      (node.row === finishNode.row && node.col === finishNode.col)
      )
    )
      continue;

    let newNode = {
      ...node,
      isVisited: true,
    };
    newGrid[node.row][node.col] = newNode;
  }
  for (let node of nodesInShortestPathOrder) {
    if (!(startNode && finishNode)  || (node.row === finishNode.row && node.col === finishNode.col)) {
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
