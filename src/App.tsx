import React from "react";
import "./App.css";
import { Stage, Layer, Rect, Circle } from "react-konva";

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

function App() {
  const [creatingRoom, setCreatingRoom] = React.useState(false);
  const [creatingWall, setCreatingWall] = React.useState(false);
  const [circlePosition, setCirclePosition] = React.useState({ x: 0, y: 0 });
  const [corners, setCorners] = React.useState<Corner[]>([]);
  // const [newCorners, setNewCorners] = React.useState<Corner[]>([]);
  const [walls, setWalls] = React.useState<Wall[]>([]);
  const [newCorner, setNewCorner] = React.useState<Corner | null>(null);

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const mousePos = stage.getRelativePointerPosition();
    setCirclePosition({ x: mousePos.x, y: mousePos.y });
    if (creatingWall) {
      if (newCorner) {
        newCorner.x = mousePos.x;
        newCorner.y = mousePos.y;
      }
    }
  };

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const mousePos = stage.getRelativePointerPosition();
    if (creatingRoom) {
    }
  };

  const handleMouseUp = (e: any) => {
    const stage = e.target.getStage();
    const mousePos = stage.getRelativePointerPosition();

    // Get nearest corner and check if it's less than 30 away from mouse

    // Problem: last corner added is floating and locked to mouse, so nearest corner is always the last corner
    const nearestCorner = corners.reduce((prev, curr) => {
      const prevDist = Math.sqrt(
        Math.pow(prev.x - mousePos.x, 2) + Math.pow(prev.y - mousePos.y, 2)
      );
      const currDist = Math.sqrt(
        Math.pow(curr.x - mousePos.x, 2) + Math.pow(curr.y - mousePos.y, 2)
      );
      return prevDist < currDist ? prev : curr;
    }, corners[0]);
    let nextCorner = null;
    if (nearestCorner) {
      const nearestCornerDist = Math.sqrt(
        Math.pow(nearestCorner.x - mousePos.x, 2) +
          Math.pow(nearestCorner.y - mousePos.y, 2)
      );
      if (nearestCornerDist < 30) {
        nextCorner = nearestCorner;
      }
      console.log(nearestCornerDist);
    }

    if (creatingWall) {
      let lastCorner = newCorner;
      let newCorners = [...corners];
      if (!lastCorner) {
        lastCorner = { x: mousePos.x, y: mousePos.y };
        newCorners.push(lastCorner);
      }
      if (!nextCorner) {
        nextCorner = { x: mousePos.x, y: mousePos.y };
        setCorners([...newCorners, nextCorner]);
      }
      const newWall = {
        corners: [lastCorner, nextCorner],
        thickness: 20,
      };
      setWalls([...walls, newWall]);
      setNewCorner(nextCorner);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="w-64 flex-none">
        <div className="flex flex-col space-y-3 p-3">
          <h1 className="text-3xl font-bold underline text-center">
            Floor Plan App
          </h1>
          <button
            className={`${
              creatingRoom ? "bg-blue-700" : "bg-blue-500"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={() => {
              setCreatingWall(false);
              setCreatingRoom(true);
            }}
          >
            <span>New room</span>
          </button>
          <button
            className={`${
              creatingWall ? "bg-blue-700" : "bg-blue-500"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={() => {
              setCreatingRoom(false);
              setCreatingWall(true);
            }}
          >
            <span>New wall</span>
          </button>
        </div>
      </div>
      <div className="canvas">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          draggable={!creatingRoom && !creatingWall}
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
            {(creatingRoom || creatingWall) && (
              // Circle follows mouse
              <Circle
                x={circlePosition.x}
                y={circlePosition.y}
                radius={5}
                fill="red"
              />
            )}
          </Layer>
          <Layer>
            <Rect
              x={20}
              y={20}
              width={100}
              height={100}
              fill="red"
              shadowBlur={5}
              draggable={true}
            />
            <Rect
              x={20}
              y={50}
              width={100}
              height={100}
              fill="blue"
              shadowBlur={5}
              draggable={false}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default App;
