//Maze Algorithms
import { randomMaze } from "./randomMaze";
import { recursiveDivisionMaze } from "./recursiveDivision";
import { verticalMaze } from "./verticalMaze";
import { horizontalMaze } from "./horizontalMaze";

const MAZES = {
    "Generate Random Maze": randomMaze,
    "Generate Recursive Maze": recursiveDivisionMaze,
    "Generate Vertical Maze": verticalMaze,
    "Generate Horizontal Maze": horizontalMaze,
}
export default function factoryMaze(mazeOption) {
    console.log(MAZES[mazeOption])
    return MAZES[mazeOption];
}