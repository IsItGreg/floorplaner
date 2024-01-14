import { Dispatch, createContext, useReducer } from "react";

export enum Mode {
  NONE = "none",
  CREATE_WALLS = "create_walls",
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
  CHANGE_MODE,
}

export type CanvasAction = { type: CanvasActions.CHANGE_MODE; mode: Mode };

const canvasReducer = (state: any, action: CanvasAction) => {
  switch (action.type) {
    case CanvasActions.CHANGE_MODE:
      return { ...state, mode: action.mode };
    default:
      return state;
  }
};
