import React from "react";
import "./App.css";
import { Stage, Layer, Rect, Circle } from "react-konva";

// essentially vertices and edges of a graph
type Corner = {
  x: number;
  y: number;
  id: number;
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
  const [newCorners, setNewCorners] = React.useState<Corner[]>([]);
  const [walls, setWalls] = React.useState<Wall[]>([]);

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const mousePos = stage.getRelativePointerPosition();
    setCirclePosition({ x: mousePos.x, y: mousePos.y });

    if (creatingRoom && newCorners.length === 4) {
      setNewCorners([
        newCorners[0],
        { ...newCorners[1], x: mousePos.x },
        { ...newCorners[2], x: mousePos.x, y: mousePos.y },
        { ...newCorners[3], y: mousePos.y },
      ]);
    } else if (creatingWall && newCorners.length === 2) {
      setNewCorners([
        newCorners[0],
        { ...newCorners[1], x: mousePos.x, y: mousePos.y },
      ]);
    }
  };

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const mousePos = stage.getRelativePointerPosition();
    if (creatingRoom) {
      const maxCornerId = Math.max(...corners.map((corner) => corner.id), 0);
      setNewCorners([
        { x: mousePos.x, y: mousePos.y, id: maxCornerId + 1 },
        { x: mousePos.x, y: mousePos.y, id: maxCornerId + 2 },
        { x: mousePos.x, y: mousePos.y, id: maxCornerId + 3 },
        { x: mousePos.x, y: mousePos.y, id: maxCornerId + 4 },
      ]);
    } else if (creatingWall) {
      const maxCornerId = Math.max(...corners.map((corner) => corner.id), 0);
      setNewCorners([
        { x: mousePos.x, y: mousePos.y, id: maxCornerId + 1 },
        { x: mousePos.x, y: mousePos.y, id: maxCornerId + 2 },
      ]);
    }
  };

  const handleMouseUp = (e: any) => {
    // const stage = e.target.getStage();
    // const mousePos = stage.getRelativePointerPosition();
    if (creatingRoom) {
      setCorners([...corners, ...newCorners]);
      setWalls([
        ...walls,
        { corners: [newCorners[0], newCorners[1]], thickness: 20 },
        { corners: [newCorners[1], newCorners[2]], thickness: 20 },
        { corners: [newCorners[2], newCorners[3]], thickness: 20 },
        { corners: [newCorners[3], newCorners[0]], thickness: 20 },
      ]);
      setNewCorners([]);
      setCreatingRoom(false);
    } else if (creatingWall) {
      setCorners([...corners, ...newCorners]);
      setWalls([
        ...walls,
        { corners: [newCorners[0], newCorners[1]], thickness: 20 },
      ]);
      setNewCorners([]);
      setCreatingWall(false);
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setCreatingWall(false);
              setCreatingRoom(true);
            }}
          >
            <span>New room</span>
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
          <Layer>
            {newCorners.map((corner, index) => (
              <Circle
                key={index}
                x={corner.x}
                y={corner.y}
                radius={10}
                fill="blue"
              />
            ))}
          </Layer>
          <Layer>
            {corners.map((corner, index) => (
              <Circle
                key={index}
                x={corner.x}
                y={corner.y}
                radius={10}
                fill="green"
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
            {creatingRoom && (
              // Circle follows mouse
              <Circle
                x={circlePosition.x}
                y={circlePosition.y}
                radius={20}
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
