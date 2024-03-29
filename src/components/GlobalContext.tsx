import { Dispatch, createContext, useReducer } from "react";
import { Box, Corner, Wall } from "./Canvas";

export enum ToolMode {
  NONE = "none",
  PAN = "pan",
  CREATE_WALLS = "create_walls",
  CREATE_ROOM = "create_room",
  CREATE_DOOR = "create_door",
  CREATE_WINDOW = "create_window",
}

export type AppState = {
  mode: ToolMode;
  snapRooms: boolean;
  walls: Wall[];
  rooms: Box[];
  selectedCorner?: Corner;
};

const initialState = {
  mode: ToolMode.NONE,
  snapRooms: true,
  walls: [],
  rooms: [],
};

export const GlobalContext = createContext<{
  state: AppState;
  dispatch: Dispatch<CanvasAction>;
}>({
  state: { mode: ToolMode.NONE, snapRooms: true, walls: [], rooms: [] },
  dispatch: () => null,
});

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export enum CanvasActions {
  CHANGE_MODE,
  TOGGLE_SNAP_ROOMS,
  SET_WALLS,
  SET_ROOMS,
  SELECT_CORNER,
  DELETE_SELECTED_CORNER,
  CLEAR_CANVAS,
}

export type CanvasAction =
  | { type: CanvasActions.CHANGE_MODE; mode: ToolMode }
  | { type: CanvasActions.TOGGLE_SNAP_ROOMS }
  | { type: CanvasActions.SET_WALLS; walls: Wall[] }
  | { type: CanvasActions.SET_ROOMS; rooms: Box[] }
  | { type: CanvasActions.CLEAR_CANVAS }
  | { type: CanvasActions.SELECT_CORNER; corner: Corner | null }
  | { type: CanvasActions.DELETE_SELECTED_CORNER };

const canvasReducer = (state: any, action: CanvasAction) => {
  switch (action.type) {
    case CanvasActions.CHANGE_MODE:
      return { ...state, mode: action.mode };
    case CanvasActions.TOGGLE_SNAP_ROOMS:
      return { ...state, snapRooms: !state.snapRooms };
    case CanvasActions.SET_WALLS:
      return { ...state, walls: action.walls };
    case CanvasActions.SET_ROOMS:
      return { ...state, rooms: action.rooms };
    case CanvasActions.CLEAR_CANVAS:
      return { ...state, walls: [], rooms: [] };
    case CanvasActions.SELECT_CORNER:
      return { ...state, selectedCorner: action.corner };
    case CanvasActions.DELETE_SELECTED_CORNER:
      return {
        ...state,
        rooms: state.rooms.filter(
          (room: Box) => !room.corners.includes(state.selectedCorner),
        ),
        selectedCorner: null,
      };
    default:
      return state;
  }
};
