import React, { useState } from "react";
import "./navbar.css";
const SPEED_OPTIONS = {
  Slow : [50, 30],
  Medium : [25, 20],
  Fast : [10, 10],
}

export default function NavBar(props){

  const [maze, setMaze] = useState("Generate Maze");
  const [pathState, setPathState] = useState(false);
  const [mazeState, setMazeState] = useState(false);
  const [speedState, setSpeedState] = useState("Speed");
  const [typeState, setTypeState] = useState("Wall");


  const selectMaze = (selection) =>{
    if (props.visualizingAlgorithm || props.generatingMaze) 
      return;

    if (pathState) 
      clearPath();
  
    if (selection === maze || maze === "Generate Maze" || maze === "Select a Maze!") 
      setMaze(selection);
    else if (pathState) 
      clearGrid();
    
    setMaze(selection);
  }

  const visualizeAlgorithm = () => {

    if (props.visualizingAlgorithm || props.generatingMaze) 
      return;
   
    if (pathState) {
      clearTemp();
      return;
    }
    setPathState(true);

    props.visualizeAStar();
  }

  const generateMaze = () => {
    if (props.visualizingAlgorithm || props.generatingMaze) {
      return;
    }

    if (mazeState || pathState) {
      clearTemp();
    }
    if (
      maze === "Generate Maze" ||
      maze === "Select a Maze!"
    ) {
      setMaze("Select a Maze!" )
    } else {
      setMazeState(true)
      props.generateMaze(maze)
    }
  }

  const clearGrid = () => {
    if (props.visualizingAlgorithm || props.generatingMaze) 
      return;
    props.clearGrid();

    setMaze("GenerateMaze");
    setPathState(false);
    setMazeState(false);
  }

  const clearPath = () => {
    if (props.visualizingAlgorithm || props.generatingMaze) 
      return;
    
    props.clearPath();

    setPathState(false);
    setMazeState(false);
  }

  const clearTemp = () => {
    if (props.visualizingAlgorithm || props.generatingMaze) 
      return;

    props.clearGrid();

    setPathState(false);
    setMazeState(false);

  }

  const changeSpeed = (speed) => {
    if (props.visualizingAlgorithm || props.generatingMaze) 
      return;

    let value = [10, 10];
    if (speed in SPEED_OPTIONS) 
      value = SPEED_OPTIONS[speed];

    setSpeedState(speed);

    props.updateSpeed(value[0], value[1]);
  }

  const changeNodeType = (type) => {
    if (props.visualizingAlgorithm || props.generatingMaze) 
      return;

    setTypeState(type);
      
    props.updateNodeType(type);
  }
  
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="navbar-collapse justify-content-center" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => visualizeAlgorithm()}
            >
              Start
            </button>
          </li>

          <li className="nav-item dropdown">
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                id="dropdownMenu1"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Mazes
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => selectMaze("Generate Random Maze")}
                >
                  Random Maze
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => selectMaze("Generate Recursive Maze")}
                >
                  Recursive Division Maze
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => selectMaze("Generate Vertical Maze")}
                >
                  Vertical Division Maze
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => selectMaze("Generate Horizontal Maze")}
                >
                  Horizontal Division Maze
                </button>
              </div>
            </div>
          </li>
          <li>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => generateMaze()}
            >
              {maze}
            </button>
          </li>
        
          <li className="nav-item dropdown">
            <div className="dropdown">
              <button
                className="btn btn-info dropdown-toggle"
                type="button"
                id="dropdownMenu1"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {speedState}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeSpeed("Slow")}
                >
                  Slow
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeSpeed("Medium")}
                >
                  Medium
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeSpeed("Fast")}
                >
                  Fast
                </button>
              </div>
            </div>
          </li>

          <li className="nav-item dropdown">
            <div className="dropdown">
              <button
                className="btn btn-info dropdown-toggle"
                type="button"
                id="dropdownMenu1"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {typeState}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeNodeType("Wall")}
                >
                  Wall 
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeNodeType("Waypoint")}
                >
                  Waypoint
                </button>
              </div>
            </div>
          </li>
          <li>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => clearGrid()}
            >
              Clear Gird
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
  
}