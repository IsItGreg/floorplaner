import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Stage, Layer, Rect, Circle } from "react-konva";

type Corner = {
  x: number;
  y: number;
};

function App() {
  const [creatingRoom, setCreatingRoom] = React.useState(false);
  const [circlePosition, setCirclePosition] = React.useState({ x: 0, y: 0 });
  const [corners, setCorners] = React.useState<Corner[]>([]);
  const [newCorners, setNewCorners] = React.useState<Corner[]>([]);

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
    }
  };

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const mousePos = stage.getRelativePointerPosition();
    if (creatingRoom) {
      setNewCorners([
        { x: mousePos.x, y: mousePos.y },
        { x: mousePos.x, y: mousePos.y },
        { x: mousePos.x, y: mousePos.y },
        { x: mousePos.x, y: mousePos.y },
      ]);
    }
  };

  const handleMouseUp = (e: any) => {
    // const stage = e.target.getStage();
    // const mousePos = stage.getRelativePointerPosition();
    if (creatingRoom) {
      setCorners([...corners, ...newCorners]);
      setNewCorners([]);
      setCreatingRoom(false);
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
            onClick={() => setCreatingRoom(true)}
          >
            <span>New room</span>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <span>New wall</span>
          </button>
        </div>
      </div>
      <div className="canvas">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          draggable={!creatingRoom}
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
