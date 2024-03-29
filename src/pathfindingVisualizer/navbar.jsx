import React, { useState } from "react";
import "./navbar.css";

export default function NavBar(props){

  const [maze, setMaze] = useState("Generate Maze");
  const [pathState, setPathState] = useState(false);
  const [mazeState, setMazeState] = useState(false);
  const [typeState, setTypeState] = useState(null);



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

    if (props.visualizingAlgorithm || props.generatingMaze )
      return;
    if(props.isStartFinish()){
      alert("Se requiere un nodo de inicio y de fin para ejecutar el algoritmo");
      return;
    }

    if (pathState) {
      clearPath();
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

    setMaze("Generate Maze");
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
                {!typeState ? "Node type" : typeState}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeNodeType("Start")}
                >
                  Start
                </button>
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeNodeType("Finish")}
                >
                  Finish
                </button>
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
                <button
                  className="dropdown-item btn-light"
                  type="button"
                  onClick={() => changeNodeType("Risky")}
                >
                  Risky
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
                Grid options
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <div
                   className="dropdown-item btn-light"
                >
                  <label className="mr-2">
                    Rows
                  </label>
                  <input type="number" min={1} value={props.numRows} onChange={(e) => {
                    if(e.target.value > 0)
                      props.setNumRows(e.target.value)
                  }}/>
                </div>
                <div
                   className="dropdown-item btn-light"
                >
                  <label className="mr-2">
                    Columns
                  </label>
                  <input type="number" min={1} value={props.numColumns} onChange={(e) => {
                    if(e.target.value > 0)
                      props.setNumColumns(e.target.value)
                    }}/>
                </div>
              </div>
            </div>
          </li>
          <li>
          <button
              type="button"
              className="btn btn-danger"
              onClick={() => clearPath()}
            >
              Clear Path
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => clearGrid()}
            >
              Clear Grid
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );

}