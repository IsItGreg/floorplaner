import React from "react";
import "../App.css";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { Button } from "@mui/material";

// essentially vertices and edges of a graph
type Corner = {
  x: number;
  y: number;
  color?: string;
};

type Wall = {
  corners: Corner[]; // 2 corners
  thickness: number;
};

enum Mode {
  None,
  CreateWalls,
}

function Planner() {
  const [mode, setMode] = React.useState(Mode.None);
  const [circlePosition, setCirclePosition] = React.useState({ x: 0, y: 0 });
  const [corners, setCorners] = React.useState<Corner[]>([]);
  const [walls, setWalls] = React.useState<Wall[]>([]);
  const [newCorner, setNewCorner] = React.useState<Corner | null>(null);

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const mousePos = stage.getRelativePointerPosition();
    setCirclePosition({ x: mousePos.x, y: mousePos.y });

    if (mode === Mode.CreateWalls) {
      if (newCorner) {
        newCorner.x = mousePos.x;
        newCorner.y = mousePos.y;
      }
    }
  };

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const mousePos = stage.getRelativePointerPosition();
    if (mode === Mode.CreateWalls) {
      if (newCorner) {
        // Creates a new corner
        const nextCorner: Corner = { x: mousePos.x, y: mousePos.y };
        setNewCorner(nextCorner);
        setCorners([...corners, nextCorner]);
        const wall = { corners: [newCorner, nextCorner], thickness: 10 };
        setWalls([...walls, wall]);
      } else {
        // Creates the first corner of a set
        const firstCorner: Corner = { x: mousePos.x, y: mousePos.y };
        const nextCorner: Corner = { x: mousePos.x, y: mousePos.y };
        setNewCorner(nextCorner);
        setCorners([...corners, firstCorner, nextCorner]);
        const wall = { corners: [firstCorner, nextCorner], thickness: 10 };
        setWalls([...walls, wall]);
      }
    }
  };

  const handleMouseUp = (e: any) => {};

  return (
    <div className="flex flex-row">
      <div className="w-64 flex-none">
        <div className="flex flex-col space-y-3 p-3">
          <h1 className="text-3xl font-bold underline text-center">
            Floor Plan App
          </h1>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setMode(Mode.CreateWalls)}
          >
            New wall
          </Button>
        </div>
      </div>
      <div className="canvas">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          // draggable={!creatingRoom && !creatingWall}
          className="bg-gray-200"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* <Layer>
            {newCorners.map((corner, index) => (
              <Circle
                key={index}
                x={corner.x}
                y={corner.y}
                radius={20}
                fill="blue"
              />
            ))}
          </Layer> */}
          <Layer>
            {corners.map((corner, index) => (
              <Circle
                key={index}
                x={corner.x}
                y={corner.y}
                radius={30}
                fill={corner.color || "green"}
              />
            ))}
          </Layer>
          <Layer>
            {walls.map((wall, index) => {
              return (
                <Rect
                  key={index}
                  offsetY={wall.thickness / 2}
                  x={wall.corners[0].x}
                  y={wall.corners[0].y}
                  width={Math.sqrt(
                    Math.pow(wall.corners[1].x - wall.corners[0].x, 2) +
                      Math.pow(wall.corners[1].y - wall.corners[0].y, 2)
                  )}
                  height={wall.thickness}
                  fill="black"
                  rotation={
                    Math.atan2(
                      wall.corners[1].y - wall.corners[0].y,
                      wall.corners[1].x - wall.corners[0].x
                    ) *
                    (180 / Math.PI)
                  }
                />
              );
            })}
          </Layer>
          <Layer>
            {true && (
              // Circle follows mouse
              <Circle
                x={circlePosition.x}
                y={circlePosition.y}
                radius={5}
                fill="red"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default Planner;
