//Maze Algorithms
import { randomMaze } from "./randomMaze";
import { recursiveDivisionMaze } from "./recursiveDivision";
import { verticalMaze } from "./verticalMaze";
import { horizontalMaze } from "./horizontalMaze";

export default function factoryMaze(mazeOption) {
    switch (mazeOption) {
        case  "Generate Random Maze": 
            return randomMaze;
        case "Generate Recursive Maze":
            return recursiveDivisionMaze;
        case "Generate Vertical Maze":
            return verticalMaze;
        case "Generate Horizontal Maze":
            return horizontalMaze;
        default:
            return () => [];
    }
}