// import Konva from "konva";
// import React from "react";
// import { Circle, Layer, Rect, Shape, Stage } from "react-konva";
// import { CanvasActions, GlobalContext, Mode } from "./GlobalContext";
// import useMeasure from "react-use-measure";

// const RADIUS = 30;

// // essentially vertices and edges of a graph
// type Corner = {
//   x: number;
//   y: number;
//   color?: string;
// };

// export type Wall = {
//   corners: Corner[]; // 2 corners
//   thickness: number;
// };

// const Canvas = () => {
//   const { state, dispatch } = React.useContext(GlobalContext);

//   const [circlePosition, setCirclePosition] = React.useState({ x: 0, y: 0 });
//   const [corners, setCorners] = React.useState<Corner[]>([]);
//   const [walls, setWalls] = React.useState<Wall[]>([]);
//   const [newCorner, setNewCorner] = React.useState<Corner | null>(null);
//   const [newWall, setNewWall] = React.useState<Wall | null>(null);
//   const [selectedCorner, setSelectedCorner] = React.useState<Corner | null>(
//     null,
//   );
//   const [draggingCorner, setDraggingCorner] = React.useState<Corner | null>(
//     null,
//   );

//   const [ref, bounds] = useMeasure();

//   React.useEffect(() => {
//     dispatch({ type: CanvasActions.SET_WALLS, walls });
//   }, [dispatch, walls]);

//   const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
//     const stage = e.target.getStage()!;
//     const mousePos = stage.getRelativePointerPosition();
//     setCirclePosition({ x: mousePos.x, y: mousePos.y });

//     if (state.mode === Mode.NONE) {
//       if (draggingCorner) {
//         draggingCorner.x = mousePos.x;
//         draggingCorner.y = mousePos.y;
//       }
//     } else if (state.mode === Mode.CREATE_WALLS) {
//       if (newCorner) {
//         newCorner.x = mousePos.x;
//         newCorner.y = mousePos.y;
//       }
//     }
//   };

//   const getCornersUnderMouse = (mousePos: { x: number; y: number }) => {
//     return corners.filter((corner) => {
//       return (
//         Math.abs(corner.x - mousePos.x) < RADIUS &&
//         Math.abs(corner.y - mousePos.y) < RADIUS &&
//         corner !== newCorner
//       );
//     });
//   };

//   const getClosestCornerFromList = (
//     mousePos: { x: number; y: number },
//     cornerList: Corner[],
//   ) => {
//     return cornerList.reduce((prev, curr) => {
//       const prevDist = Math.sqrt(
//         Math.pow(prev.x - mousePos.x, 2) + Math.pow(prev.y - mousePos.y, 2),
//       );
//       const currDist = Math.sqrt(
//         Math.pow(curr.x - mousePos.x, 2) + Math.pow(curr.y - mousePos.y, 2),
//       );
//       return prevDist < currDist ? prev : curr;
//     });
//   };

//   const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
//     const stage = e.target.getStage()!;
//     const mousePos = stage.getRelativePointerPosition();
//     if (state.mode === Mode.NONE) {
//       const cornersUnderMouse = getCornersUnderMouse(mousePos);
//       if (cornersUnderMouse.length > 0) {
//         const nearestCorner = getClosestCornerFromList(
//           mousePos,
//           cornersUnderMouse,
//         );
//         if (selectedCorner !== nearestCorner) {
//           setSelectedCorner(nearestCorner);
//         }
//         setDraggingCorner(nearestCorner);
//       } else {
//         setSelectedCorner(null);
//       }
//     } else if (state.mode === Mode.CREATE_WALLS) {
//       const cornersUnderMouse = getCornersUnderMouse(mousePos);
//       if (cornersUnderMouse.length > 0) {
//         const nearestCorner = getClosestCornerFromList(
//           mousePos,
//           cornersUnderMouse,
//         );
//         if (newWall && newCorner) {
//           // Clicked on the same corner
//           if (newWall) {
//             newWall.corners[1] = nearestCorner;
//             if (
//               newWall.corners[0] === newWall.corners[1] ||
//               walls.filter(
//                 (wall) =>
//                   newWall.corners.includes(wall.corners[0]) &&
//                   newWall.corners.includes(wall.corners[1]) &&
//                   wall !== newWall,
//               ).length > 0
//             ) {
//               // remove new wall from walls
//               setWalls(walls.filter((wall) => wall !== newWall));
//             }
//             setNewWall(null);
//           }
//           // remove new corner from corners
//           setCorners(corners.filter((corner) => corner !== newCorner));
//           setNewCorner(null);
//           dispatch({ type: CanvasActions.CHANGE_MODE, mode: Mode.NONE });
//         } else {
//           // Clicked on a new corner
//           const nextCorner: Corner = { x: mousePos.x, y: mousePos.y };
//           setNewCorner(nextCorner);
//           setCorners([...corners, nextCorner]);
//           const wall = { corners: [nearestCorner, nextCorner], thickness: 10 };
//           setNewWall(wall);
//           setWalls([...walls, wall]);
//         }
//       } else {
//         if (newCorner) {
//           // Creates a new corner
//           const nextCorner: Corner = { x: mousePos.x, y: mousePos.y };
//           setNewCorner(nextCorner);
//           setCorners([...corners, nextCorner]);
//           const wall = { corners: [newCorner, nextCorner], thickness: 10 };
//           setNewWall(wall);
//           setWalls([...walls, wall]);
//         } else {
//           // Creates the first corner of a set
//           const firstCorner: Corner = { x: mousePos.x, y: mousePos.y };
//           const nextCorner: Corner = { x: mousePos.x, y: mousePos.y };
//           setNewCorner(nextCorner);
//           setCorners([...corners, firstCorner, nextCorner]);
//           const wall = { corners: [firstCorner, nextCorner], thickness: 10 };
//           setNewWall(wall);
//           setWalls([...walls, wall]);
//         }
//       }
//     }
//   };

//   const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
//     if (draggingCorner) {
//       setDraggingCorner(null);
//     }
//   };

//   return (
//     <div ref={ref} className="canvas h-full w-full">
//       <Stage
//         width={bounds.width}
//         height={bounds.height}
//         // draggable={!creatingRoom && !creatingWall}
//         className="bg-slate-50"
//         onMouseMove={handleMouseMove}
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//       >
//         {/* <Layer>
//       {newCorners.map((corner, index) => (
//         <Circle
//           key={index}
//           x={corner.x}
//           y={corner.y}
//           radius={20}
//           fill="blue"
//         />
//       ))}
//     </Layer> */}
//         <Layer>
//           {corners.map((corner, index) => (
//             <Circle
//               key={index}
//               x={corner.x}
//               y={corner.y}
//               radius={RADIUS}
//               fill={selectedCorner === corner ? "purple" : "green"}
//             />
//           ))}
//         </Layer>
//         <Layer>
//           {walls.map((wall, index) => {
//             return (
//               <Rect
//                 key={index}
//                 offsetY={wall.thickness / 2}
//                 x={wall.corners[0].x}
//                 y={wall.corners[0].y}
//                 width={Math.sqrt(
//                   Math.pow(wall.corners[1].x - wall.corners[0].x, 2) +
//                     Math.pow(wall.corners[1].y - wall.corners[0].y, 2),
//                 )}
//                 height={wall.thickness}
//                 fill="black"
//                 rotation={
//                   Math.atan2(
//                     wall.corners[1].y - wall.corners[0].y,
//                     wall.corners[1].x - wall.corners[0].x,
//                   ) *
//                   (180 / Math.PI)
//                 }
//               />
//             );
//           })}
//         </Layer>
//         <Layer>
//           {corners.map((corner, index) => {
//             // get walls that have this corner
//             const wallsWithCorner = walls.filter((wall) =>
//               wall.corners.includes(corner),
//             );

//             // dont continue if there is less than two walls
//             if (wallsWithCorner.length < 2) return null;

//             // map walls to know the positive angle of the wall away from the other corner
//             const wallsAndAngles = wallsWithCorner.map((wall) => {
//               const otherCorner = wall.corners.filter((c) => c !== corner)[0];
//               const angle = Math.atan2(
//                 otherCorner.y - corner.y,
//                 otherCorner.x - corner.x,
//               );
//               return { wall, angle: angle < 0 ? angle + 2 * Math.PI : angle };
//             });

//             // sort the angles
//             const sortedWallsAndAngles = wallsAndAngles.sort(
//               (a, b) => a.angle - b.angle,
//             );

//             // add firt angle + 2pi to end of array
//             sortedWallsAndAngles.push({
//               ...sortedWallsAndAngles[0],
//               angle: sortedWallsAndAngles[0].angle + 2 * Math.PI,
//             });

//             // find the two consecutive walls that have an angle of more than pi between them
//             const wallsAndAnglesWithGaps = sortedWallsAndAngles
//               .map((wA, index) => {
//                 return {
//                   wA,
//                   nextWA:
//                     sortedWallsAndAngles[index + 1] || sortedWallsAndAngles[0],
//                 };
//               })
//               .filter(({ wA, nextWA }) => nextWA.angle - wA.angle > Math.PI);

//             // if there are no gaps, return null
//             if (wallsAndAnglesWithGaps.length === 0) return null;

//             const leftPoint = {
//               x:
//                 corner.x +
//                 (wallsAndAnglesWithGaps[0].wA.wall.thickness / 2) *
//                   Math.cos(wallsAndAnglesWithGaps[0].wA.angle + Math.PI / 2),
//               y:
//                 corner.y +
//                 (wallsAndAnglesWithGaps[0].wA.wall.thickness / 2) *
//                   Math.sin(wallsAndAnglesWithGaps[0].wA.angle + Math.PI / 2),
//             };

//             const rightPoint = {
//               x:
//                 corner.x +
//                 (wallsAndAnglesWithGaps[0].wA.wall.thickness / 2) *
//                   Math.cos(
//                     wallsAndAnglesWithGaps[0].nextWA.angle - Math.PI / 2,
//                   ),
//               y:
//                 corner.y +
//                 (wallsAndAnglesWithGaps[0].wA.wall.thickness / 2) *
//                   Math.sin(
//                     wallsAndAnglesWithGaps[0].nextWA.angle - Math.PI / 2,
//                   ),
//             };

//             // find intersection of lines extending from left and right points
//             const m1 = Math.tan(wallsAndAnglesWithGaps[0].wA.angle);
//             const m2 = Math.tan(wallsAndAnglesWithGaps[0].nextWA.angle);
//             const x =
//               (m1 * leftPoint.x -
//                 m2 * rightPoint.x +
//                 rightPoint.y -
//                 leftPoint.y) /
//               (m1 - m2);
//             const y = m1 * (x - leftPoint.x) + leftPoint.y;

//             return (
//               <Shape
//                 sceneFunc={(context, shape) => {
//                   context.beginPath();
//                   context.moveTo(leftPoint.x, leftPoint.y);
//                   context.lineTo(x, y);
//                   context.lineTo(rightPoint.x, rightPoint.y);
//                   context.lineTo(corner.x, corner.y);
//                   context.closePath();
//                   context.fillStrokeShape(shape);
//                 }}
//                 fill="red"
//               />
//             );
//           })}
//         </Layer>
//         <Layer>
//           {true && (
//             // Circle follows mouse
//             <Circle
//               x={circlePosition.x}
//               y={circlePosition.y}
//               radius={5}
//               fill="red"
//             />
//           )}
//         </Layer>
//       </Stage>
//     </div>
//   );
// };

// export default Canvas;

export {};
