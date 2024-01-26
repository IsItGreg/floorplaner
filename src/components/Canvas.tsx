import Konva from "konva";
import React, { useEffect } from "react";
import { Circle, Layer, Rect, Text, Shape, Stage } from "react-konva";
import { CanvasActions, GlobalContext, ToolMode } from "./GlobalContext";
import useMeasure from "react-use-measure";

const RADIUS = 30;
const GRID = 100;

// essentially vertices and edges of a graph
type Corner = {
  x: number;
  y: number;
  color?: string;
  small?: boolean;
};

export type Wall = {
  corners: Corner[]; // 2 corners
  thickness: number;
};

export enum BoxType {
  ROOM,
  DOOR,
  WINDOW,
}

export type Box = {
  corners: Corner[]; // 2 corners
  type: BoxType;
};

const Canvas = () => {
  const { state, dispatch } = React.useContext(GlobalContext);

  const [boxes, setBoxes] = React.useState<Box[]>(state.rooms);
  const [corners, setCorners] = React.useState<Corner[]>(
    state.rooms.flatMap((room) => room.corners),
  );

  useEffect(() => {
    setBoxes(state.rooms);
    setCorners(state.rooms.flatMap((room) => room.corners));
  }, [state.rooms]);

  const [circlePosition, setCirclePosition] = React.useState({ x: 0, y: 0 });

  const [newCorner, setNewCorner] = React.useState<Corner | null>(null);

  const [newBox, setNewBox] = React.useState<Box | null>(null);

  const [selectedCorner, setSelectedCorner] = React.useState<Corner | null>(
    null,
  );
  const [draggingCorner, setDraggingCorner] = React.useState<Corner | null>(
    null,
  );

  const [xSnappingPoints, setXSnappingPoints] = React.useState<number[]>([]);
  const [ySnappingPoints, setYSnappingPoints] = React.useState<number[]>([]);

  const [measureRef, bounds] = useMeasure();

  const rooms = boxes.filter((box) => box.type === BoxType.ROOM);
  const doors = boxes.filter((box) => box.type === BoxType.DOOR);
  const windows = boxes.filter((box) => box.type === BoxType.WINDOW);

  React.useEffect(() => {
    dispatch({ type: CanvasActions.SET_ROOMS, rooms: boxes });
  }, [dispatch, boxes]);

  React.useEffect(() => {
    setSelectedCorner(null);
    setDraggingCorner(null);
  }, [state.mode]);

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()!;
    const mousePos = stage.getRelativePointerPosition();

    const nearestSnapX =
      xSnappingPoints.length > 0
        ? xSnappingPoints.reduce((prev, curr) => {
            return Math.abs(curr - mousePos.x) < Math.abs(prev - mousePos.x)
              ? curr
              : prev;
          })
        : null;

    const nearestSnapY =
      ySnappingPoints.length > 0
        ? ySnappingPoints.reduce((prev, curr) => {
            return Math.abs(curr - mousePos.y) < Math.abs(prev - mousePos.y)
              ? curr
              : prev;
          })
        : null;

    const shouldSnap = state.snapRooms !== e.evt.shiftKey;

    const shouldSnapX =
      shouldSnap &&
      nearestSnapX !== null &&
      Math.abs(mousePos.x - nearestSnapX) < 10;
    const shouldSnapY =
      shouldSnap &&
      nearestSnapY !== null &&
      Math.abs(mousePos.y - nearestSnapY) < 10;

    const newXPos = shouldSnapX ? nearestSnapX : mousePos.x;
    const newYPos = shouldSnapY ? nearestSnapY : mousePos.y;

    setCirclePosition({
      x: newXPos,
      y: newYPos,
    });

    if (state.mode === ToolMode.NONE) {
      if (draggingCorner) {
        draggingCorner.x = newXPos;
        draggingCorner.y = newYPos;
      }
    } else if (
      state.mode === ToolMode.CREATE_ROOM ||
      state.mode === ToolMode.CREATE_DOOR ||
      state.mode === ToolMode.CREATE_WINDOW
    ) {
      if (newCorner) {
        newCorner.x = newXPos;
        newCorner.y = newYPos;
      }
    }
  };

  const getCornersUnderMouse = (mousePos: { x: number; y: number }) => {
    return corners.filter((corner) => {
      return (
        Math.abs(corner.x - mousePos.x) < RADIUS &&
        Math.abs(corner.y - mousePos.y) < RADIUS &&
        corner !== newCorner
      );
    });
  };

  const getClosestCornerFromList = (
    mousePos: { x: number; y: number },
    cornerList: Corner[],
  ) => {
    return cornerList.reduce((prev, curr) => {
      const prevDist = Math.sqrt(
        Math.pow(prev.x - mousePos.x, 2) + Math.pow(prev.y - mousePos.y, 2),
      );
      const currDist = Math.sqrt(
        Math.pow(curr.x - mousePos.x, 2) + Math.pow(curr.y - mousePos.y, 2),
      );
      return prevDist < currDist ? prev : curr;
    });
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()!;
    const mousePos = stage.getRelativePointerPosition();
    if (e.evt.button === 1) {
      stage.startDrag();
    } else if (state.mode === ToolMode.NONE) {
      const cornersUnderMouse = getCornersUnderMouse(mousePos);
      if (cornersUnderMouse.length > 0) {
        const nearestCorner = getClosestCornerFromList(
          mousePos,
          cornersUnderMouse,
        );
        if (selectedCorner !== nearestCorner) {
          setSelectedCorner(nearestCorner);
          // const selectedCornersRoom = rooms.splice( // Makes the selected room appear on top of other rooms
          //   rooms.findIndex((room) => room.corners.includes(nearestCorner)),
          //   1,
          // )[0];
          // setRooms([...rooms, selectedCornersRoom]);
        }
        setDraggingCorner(nearestCorner);
      } else {
        setSelectedCorner(null);
      }
    } else if (
      state.mode === ToolMode.CREATE_ROOM ||
      state.mode === ToolMode.CREATE_DOOR ||
      state.mode === ToolMode.CREATE_WINDOW
    ) {
      if (newCorner) {
        setNewBox(null);
        setNewCorner(null);
        dispatch({ type: CanvasActions.CHANGE_MODE, mode: ToolMode.NONE });
      } else {
        // Create first corner of room
        const firstCorner: Corner = {
          x: mousePos.x,
          y: mousePos.y,
          small: state.mode !== ToolMode.CREATE_ROOM,
        };
        const nextCorner: Corner = {
          x: mousePos.x,
          y: mousePos.y,
          small: state.mode !== ToolMode.CREATE_ROOM,
        };
        setNewCorner(nextCorner);
        setCorners([...corners, firstCorner, nextCorner]);
        const roomType =
          state.mode === ToolMode.CREATE_ROOM
            ? BoxType.ROOM
            : state.mode === ToolMode.CREATE_DOOR
              ? BoxType.DOOR
              : BoxType.WINDOW;
        const room = {
          corners: [firstCorner, nextCorner],
          type: roomType,
        };
        setNewBox(room);
        setBoxes([...boxes, room]);
      }
    }
  };

  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (draggingCorner) {
      setDraggingCorner(null);

      const newXSnappingPoints = boxes.flatMap((room) => {
        const possible = room.corners
          .filter((corner) => corner !== selectedCorner)
          .flatMap((corner) => [corner.x - 10, corner.x, corner.x + 10]);
        return possible.filter(
          (x) =>
            room.corners.every((corner) => corner.x <= x) ||
            room.corners.every((corner) => corner.x >= x),
        );
      });

      const newYSnappingPoints = boxes.flatMap((room) => {
        const possible = room.corners
          .filter((corner) => corner !== selectedCorner)
          .flatMap((corner) => [corner.y - 10, corner.y, corner.y + 10]);
        return possible.filter(
          (y) =>
            room.corners.every((corner) => corner.y <= y) ||
            room.corners.every((corner) => corner.y >= y),
        );
      });

      setXSnappingPoints(newXSnappingPoints);
      setYSnappingPoints(newYSnappingPoints);
    }
  };

  const handleScroll = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = e.target.getStage()!;

    const oldScale = stage.scaleX();
    const pointerPos = stage.getPointerPosition()!;
    const mousePointTo = {
      x: (pointerPos.x - stage.x()) / oldScale,
      y: (pointerPos.y - stage.y()) / oldScale,
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointerPos.x - mousePointTo.x * newScale,
      y: pointerPos.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
  };

  const konvaUnitsToDistanceString = (konvaUnits: number) => {
    return `${Math.round((Math.abs(konvaUnits) * 100) / GRID) / 100}m`;
  };

  return (
    <div ref={measureRef} className="canvas h-full w-full">
      <Stage
        width={bounds.width}
        height={bounds.height}
        // draggable={!creatingRoom && !creatingWall}
        className="bg-slate-50"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onWheel={handleScroll}
        draggable={state.mode === ToolMode.PAN}
      >
        <Layer>
          {/* Layer for walls around rooms */}
          {rooms.map((room, index) => {
            return (
              <Rect
                x={room.corners[0].x}
                y={room.corners[0].y}
                width={room.corners[1].x - room.corners[0].x}
                height={room.corners[1].y - room.corners[0].y}
                stroke="black"
                strokeWidth={20}
              />
            );
          })}
        </Layer>
        <Layer>
          {/* Layer for rooms */}
          {rooms.map((room, index) => {
            const width = room.corners[1].x - room.corners[0].x;
            const height = room.corners[1].y - room.corners[0].y;

            return (
              <>
                <Rect
                  x={room.corners[0].x}
                  y={room.corners[0].y}
                  width={room.corners[1].x - room.corners[0].x}
                  height={room.corners[1].y - room.corners[0].y}
                  fill="#AD937B"
                />
                <Text
                  x={room.corners[0].x + width / 2}
                  y={room.corners[0].y + (height > 0 ? 0 : height) + 5}
                  text={konvaUnitsToDistanceString(width)}
                  fontSize={20}
                  fill="#6E655C"
                />
                <Text
                  x={room.corners[0].x + (width > 0 ? 0 : width) + 5}
                  y={room.corners[0].y + height / 2 + 20}
                  rotation={-90}
                  text={konvaUnitsToDistanceString(height)}
                  fontSize={20}
                  fill="#6E655C"
                />
              </>
            );
          })}
        </Layer>
        <Layer>
          {/* Layer for doors and windows */}
          {windows.map((window, index) => {
            const width = window.corners[1].x - window.corners[0].x;
            const height = window.corners[1].y - window.corners[0].y;

            const isHorizontal = Math.abs(width) > Math.abs(height);

            return (
              <>
                <Rect
                  x={window.corners[0].x}
                  y={window.corners[0].y}
                  width={window.corners[1].x - window.corners[0].x}
                  height={window.corners[1].y - window.corners[0].y}
                  fill="#9DAACF"
                  stroke="black"
                  strokeWidth={2}
                />
                {isHorizontal ? (
                  <Text
                    x={window.corners[0].x + width / 2 - 20}
                    y={window.corners[0].y + (height > 0 ? 0 : height) + 1}
                    text={konvaUnitsToDistanceString(width)}
                    fontSize={9}
                    fill="#33281E"
                  />
                ) : (
                  <Text
                    x={window.corners[0].x + (width > 0 ? 0 : width) + 1}
                    y={window.corners[0].y + height / 2 + 20}
                    rotation={-90}
                    text={konvaUnitsToDistanceString(height)}
                    fontSize={9}
                    fill="#33281E"
                  />
                )}
              </>
            );
          })}
          {doors.map((door, index) => {
            const width = door.corners[1].x - door.corners[0].x;
            const height = door.corners[1].y - door.corners[0].y;

            const isHorizontal = Math.abs(width) > Math.abs(height);

            return (
              <>
                <Rect
                  x={door.corners[0].x}
                  y={door.corners[0].y}
                  width={door.corners[1].x - door.corners[0].x}
                  height={door.corners[1].y - door.corners[0].y}
                  fill="#72AD83"
                  stroke="black"
                  strokeWidth={2}
                />
                {isHorizontal ? (
                  <Text
                    x={door.corners[0].x + width / 2 - 20}
                    y={door.corners[0].y + (height > 0 ? 0 : height) + 1}
                    text={konvaUnitsToDistanceString(width)}
                    fontSize={9}
                    fill="#33281E"
                  />
                ) : (
                  <Text
                    x={door.corners[0].x + (width > 0 ? 0 : width) + 1}
                    y={door.corners[0].y + height / 2 + 20}
                    rotation={-90}
                    text={konvaUnitsToDistanceString(height)}
                    fontSize={9}
                    fill="#33281E"
                  />
                )}
              </>
            );
          })}
        </Layer>
        <Layer>
          {/* Layer for room lines and distances */}
          {rooms.map((room, index) => {
            const width = room.corners[1].x - room.corners[0].x;
            const height = room.corners[1].y - room.corners[0].y;

            return (
              <>
                <Rect
                  x={room.corners[0].x}
                  y={room.corners[0].y}
                  width={room.corners[1].x - room.corners[0].x}
                  height={room.corners[1].y - room.corners[0].y}
                  stroke={"#6E655C"}
                  dash={[10, 15]}
                />
                <Text
                  x={room.corners[0].x + width / 2}
                  y={room.corners[0].y + (height > 0 ? 0 : height) + 5}
                  text={konvaUnitsToDistanceString(width)}
                  fontSize={20}
                  fill="#33281E"
                />
                <Text
                  x={room.corners[0].x + (width > 0 ? 0 : width) + 5}
                  y={room.corners[0].y + height / 2 + 20}
                  rotation={-90}
                  text={konvaUnitsToDistanceString(height)}
                  fontSize={20}
                  fill="#33281E"
                />
              </>
            );
          })}
        </Layer>
        <Layer>
          {/* Layer for movable corners of rooms */}
          {corners.map((corner, index) => (
            <Circle
              key={index}
              x={corner.x}
              y={corner.y}
              radius={corner.small ? RADIUS / 2 : RADIUS}
              // fill={selectedCorner === corner ? "#435458" : undefined}
              // opacity={selectedCorner === corner ? 0.5 : undefined}
              stroke={selectedCorner === corner ? "#7BA3AD" : "#6E655C"}
              dash={selectedCorner === corner ? undefined : [10, 5]}
              // dash={[10, 5]}
            />
          ))}
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
  );
};

export default Canvas;
