import { Dispatch, createContext, useReducer } from "react";
import { Wall } from "./Canvas";

export enum Mode {
  NONE = "none",
  CREATE_WALLS = "create_walls",
}

export type AppState = {
  mode: Mode;
  walls: Wall[];
};

const initialState = {
  mode: Mode.NONE,
  walls: [],
};

export const GlobalContext = createContext<{
  state: AppState;
  dispatch: Dispatch<CanvasAction>;
}>({ state: { mode: Mode.NONE, walls: [] }, dispatch: () => null });

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
}

export type CanvasAction =
  | { type: CanvasActions.CHANGE_MODE; mode: Mode }
  | { type: CanvasActions.SET_WALLS; walls: Wall[] };

const canvasReducer = (state: any, action: CanvasAction) => {
  switch (action.type) {
    case CanvasActions.CHANGE_MODE:
      return { ...state, mode: action.mode };
    case CanvasActions.SET_WALLS:
      return { ...state, walls: action.walls };
    default:
      return state;
  }
};
