import React from "react";
import { CanvasActions, GlobalContext } from "./GlobalContext";
import { convertRoomsToStl } from "../three/roomsToStl";
import {
  DeleteForever,
  SaveAlt,
  UploadFile,
  ViewInAr,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { download } from "../download";

export const Sidebar = () => {
  const { state, dispatch } = React.useContext(GlobalContext);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex h-full w-64 flex-shrink-0 flex-col gap-5 bg-slate-800 shadow">
      <h1 className="mt-10 text-center text-3xl font-bold text-slate-200">
        FLAURD
      </h1>
      <h2 className="mx-5 text-center text-lg text-slate-200">
        Flexible Layouts And Unrestricted Room Design
      </h2>
      <Tooltip
        title="Warning, this will replace the current floor plan"
        arrow
        placement="bottom"
      >
        <button
          className="mx-5 rounded-md border-2 border-slate-300 p-2 text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
        >
          <input
            ref={inputRef}
            hidden
            className="mx-5 rounded-md border-2 border-slate-300 p-2 text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const json = e.target?.result;
                  if (typeof json === "string") {
                    dispatch({
                      type: CanvasActions.SET_ROOMS,
                      rooms: JSON.parse(json),
                    });
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
          <UploadFile className="mb-0.5 mr-2" />
          Upload Save File
        </button>
      </Tooltip>
      <Tooltip
        title="Download floor plan as a .json file"
        arrow
        placement="bottom"
      >
        <button
          className="mx-5 rounded-md border-2 border-slate-300 p-2 text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={state.rooms.length === 0}
          onClick={() => {
            download(
              new Blob([JSON.stringify(state.rooms)]),
              "floorplansave.json",
            );
          }}
        >
          <SaveAlt className="mb-0.5 mr-2" />
          Download Save File
        </button>
      </Tooltip>
      <button
        className="mx-5 rounded-md border-2 border-slate-300 p-2 text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={state.rooms.length === 0}
        onClick={() => {
          convertRoomsToStl(state.rooms);
        }}
      >
        <ViewInAr className="mb-0.5 mr-2" />
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
