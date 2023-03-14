import React from "react";
import "./node.css";
import { useState } from "react";

export default function Node({
  row,
  col,
  isStart,
  isFinish,
  isWall,
  isVisited,
  isShortest,
  isWaypoint,
  onMouseEnter,
  onMouseDown,
  onMouseUp,
  width,
  height,
  numRows,
  numColumns,
}){
    const extraClass = isStart
      ? "node node-start"
      : isFinish
      ? "node node-finish"
      : isWall
      ? "node-wall" 
      : isWaypoint
      ? "node node-waypoint"
      : isShortest
      ? "node node-shortest-path"
      : isVisited
      ? "node node-visited"
      : "node";
    
    let cellWidth = Math.floor((width - 15) / numColumns);
    let cellHeight;
    if (width > 1000) {
      cellHeight = Math.floor((height - 70) / numRows);
    } else if (width > 500) {
      cellHeight = Math.floor((height - 60) / numRows);
    } else if (width > 0) {
      cellHeight = Math.floor((height - 50) / numRows);
    }

    return (
      <div
        id={`node-${row}-${col}`}
        className={`${extraClass}`}
        style={{ "--width": `${cellWidth}px`, "--height": `${cellHeight}px` }}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={() => onMouseUp()}
      >

      </div>
    );
}

