import { Dispatch, createContext, useReducer } from "react";

export enum Mode {
  NONE,
  CREATE_WALLS,
}

export type AppState = {
  mode: Mode;
};

const initialState = {
  mode: Mode.NONE,
};

export const GlobalContext = createContext<{
  state: AppState;
  dispatch: Dispatch<CanvasAction>;
}>({ state: { mode: Mode.NONE }, dispatch: () => null });

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
  CREATE_WALLS = "CREATE_WALLS",
  RESET_MODE = "RESET_MODE",
}

export type CanvasAction =
  | { type: CanvasActions.CREATE_WALLS }
  | { type: CanvasActions.RESET_MODE };

const canvasReducer = (state: any, action: CanvasAction) => {
  switch (action.type) {
    case CanvasActions.CREATE_WALLS:
      return { ...state, mode: Mode.CREATE_WALLS };
    case CanvasActions.RESET_MODE:
      return { ...state, mode: Mode.NONE };
    default:
      return state;
  }
};
