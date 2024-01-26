import React from "react";
import { CanvasActions, GlobalContext } from "./GlobalContext";
import { convertRoomsToStl } from "../three/roomsToStl";
import { DeleteForever, Download } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const Sidebar = () => {
  const { state, dispatch } = React.useContext(GlobalContext);

  return (
    <div className="flex h-full w-64 flex-shrink-0 flex-col gap-5 bg-slate-800 shadow">
      <h1 className="mt-10 text-center text-3xl font-bold text-slate-200">
        FLAURD
      </h1>
      <h2 className="mx-5 text-center text-lg text-slate-200">
        Flexible Layouts And Unrestricted Room Design
      </h2>
      <button
        className="mx-5 rounded-md border-2 border-slate-300 p-2 text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={state.rooms.length === 0}
        onClick={() => {
          convertRoomsToStl(state.rooms);
        }}
      >
        <Download className="mb-0.5 mr-2" />
        Download STL
      </button>
      <Tooltip title="Warning, this cannot be undone." arrow placement="bottom">
        <button
          className="mx-5 rounded-md border-2 border-red-300 p-2 text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={state.rooms.length === 0}
          onClick={() => {
            dispatch({ type: CanvasActions.CLEAR_CANVAS });
          }}
        >
          <DeleteForever className="mb-0.5 mr-2" />
          Clear Canvas
        </button>
      </Tooltip>
    </div>
  );
};
