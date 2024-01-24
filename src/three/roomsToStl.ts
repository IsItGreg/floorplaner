import { Box, BoxType } from "../components/Canvas";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { ADDITION, SUBTRACTION, Brush, Evaluator } from "three-bvh-csg";

const ROOM_HEIGHT = 240;
const DOOR_HEIGHT = 200;
const WINDOW_HEIGHT = 120;

const save = (blob: Blob, filename: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const getRoomWithWalls = (room: Box, wallThickness: number = 10): Box => {
  // room is two points
  // room with walls should be room but wallthickness bigger
  // so if room is (0, 0) (100, 100) and wallthickness is 10
  // room with walls should be (-10, -10) (110, 110)

  const maxLeft = Math.min(room.corners[0].x, room.corners[1].x);
  const maxRight = Math.max(room.corners[0].x, room.corners[1].x);
  const maxTop = Math.min(room.corners[0].y, room.corners[1].y);
  const maxBottom = Math.max(room.corners[0].y, room.corners[1].y);

  const roomWithWalls = {
    corners: [
      { x: maxLeft - wallThickness, y: maxTop - wallThickness },
      { x: maxRight + wallThickness, y: maxBottom + wallThickness },
    ],
    type: BoxType.ROOM,
  };

  return roomWithWalls;
};

const roomToThreeJs = (room: Box, height: number = ROOM_HEIGHT) => {
  const points = [
    { x: room.corners[0].x, y: room.corners[0].y },
    { x: room.corners[0].x, y: room.corners[1].y },
    { x: room.corners[1].x, y: room.corners[1].y },
    { x: room.corners[1].x, y: room.corners[0].y },
    { x: room.corners[0].x, y: room.corners[0].y },
  ];

  const shape = new THREE.Shape();
  shape.moveTo(points[0].x, -points[0].y);
  points.forEach((point) => {
    shape.lineTo(point.x, -point.y);
  });

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
  });

  return geometry;
};

export const convertRoomsToStl = (boxes: Box[]) => {
  const rooms = boxes.filter((box) => box.type === BoxType.ROOM);
  const doors = boxes.filter((box) => box.type === BoxType.DOOR);
  const windows = boxes.filter((box) => box.type === BoxType.WINDOW);

  const threeJsRooms = rooms.map((room) => roomToThreeJs(room));
  const threeJsRoomsWithWalls = rooms.map((room) =>
    roomToThreeJs(getRoomWithWalls(room)),
  );
  const threeJsDoors = doors.map((door) => roomToThreeJs(door, DOOR_HEIGHT));
  const threeJsWindows = windows.map((window) =>
    roomToThreeJs(window, WINDOW_HEIGHT),
  );

  const additionBrushes = threeJsRoomsWithWalls.map((room) => {
    const brush = new Brush(room);
    brush.updateMatrixWorld();
    return brush;
  });

  const subtractionBrushes = threeJsRooms.map((room) => {
    const brush = new Brush(room);
    brush.translateZ(10);
    brush.updateMatrixWorld();
    return brush;
  });

  const doorBrushes = threeJsDoors.map((door) => {
    const brush = new Brush(door);
    brush.translateZ(10);
    brush.updateMatrixWorld();
    return brush;
  });

  const windowBrushes = threeJsWindows.map((window) => {
    const brush = new Brush(window);
    brush.translateZ(70);
    brush.updateMatrixWorld();
    return brush;
  });

  const evaluator = new Evaluator();
  let result = additionBrushes[0].clone();
  result.updateMatrixWorld();

  additionBrushes.slice(1).forEach((brush) => {
    result = evaluator.evaluate(result, brush, ADDITION);
  });

  subtractionBrushes.forEach((brush) => {
    result = evaluator.evaluate(result, brush, SUBTRACTION);
  });

  doorBrushes.forEach((brush) => {
    result = evaluator.evaluate(result, brush, SUBTRACTION);
  });

  windowBrushes.forEach((brush) => {
    result = evaluator.evaluate(result, brush, SUBTRACTION);
  });

  const exporter = new STLExporter();
  const stl = exporter.parse(result);

  save(new Blob([stl], { type: "application/octet-stream" }), "room.stl");
};
