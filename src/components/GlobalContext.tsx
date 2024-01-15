import { Dispatch, createContext, useReducer } from "react";
import { Room, Wall } from "./Canvas";

export enum ToolMode {
  NONE = "none",
  CREATE_WALLS = "create_walls",
  CREATE_ROOM = "create_room",
}

export type AppState = {
  mode: ToolMode;
  walls: Wall[];
  rooms: Room[];
};

const initialState = {
  mode: ToolMode.NONE,
  walls: [],
  rooms: [],
};

export const GlobalContext = createContext<{
  state: AppState;
  dispatch: Dispatch<CanvasAction>;
}>({
  state: { mode: ToolMode.NONE, walls: [], rooms: [] },
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
  SET_WALLS,
  SET_ROOMS,
}

export type CanvasAction =
  | { type: CanvasActions.CHANGE_MODE; mode: ToolMode }
  | { type: CanvasActions.SET_WALLS; walls: Wall[] }
  | { type: CanvasActions.SET_ROOMS; rooms: Room[] };

const canvasReducer = (state: any, action: CanvasAction) => {
  switch (action.type) {
    case CanvasActions.CHANGE_MODE:
      return { ...state, mode: action.mode };
    case CanvasActions.SET_WALLS:
      return { ...state, walls: action.walls };
    case CanvasActions.SET_ROOMS:
      return { ...state, rooms: action.rooms };
    default:
      return state;
  }
};
