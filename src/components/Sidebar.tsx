import React from "react";
import { CanvasActions, GlobalContext } from "./GlobalContext";
import { convertRoomsToStl } from "../three/roomsToStl";

export const Sidebar = () => {
  const { state, dispatch } = React.useContext(GlobalContext);

  return (
    <div className="flex h-full w-64 flex-shrink-0 flex-col gap-5 bg-slate-800">
      <h1 className="mt-10 text-center text-3xl font-bold text-slate-200">
        FLAURD
      </h1>
      <h2 className="mx-5 text-center text-lg text-slate-200">
        Flexible Layouts And Unrestricted Room Design
      </h2>
      <button
        className="mx-5 rounded-md border border-slate-200 text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={state.rooms.length === 0}
        onClick={() => {
          convertRoomsToStl(state.rooms);
        }}
      >
        Download STL
      </button>
      <button
        className="mx-5 rounded-md border border-slate-200 text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={state.rooms.length === 0}
        onClick={() => {
          dispatch({ type: CanvasActions.CLEAR_CANVAS });
        }}
      >
        Clear Canvas
      </button>
    </div>
  );
};
