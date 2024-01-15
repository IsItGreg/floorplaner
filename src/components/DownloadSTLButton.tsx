import React from "react";
import { GlobalContext } from "./GlobalContext";
import { convertRoomsToStl } from "../three/roomsToStl";

export const DownloadSTLButton = () => {
  const { state } = React.useContext(GlobalContext);

  return (
    <button
      className="m-5 rounded-md border border-slate-200 text-slate-200"
      onClick={() => {
        console.log(state.rooms);
        convertRoomsToStl(state.rooms);
      }}
    >
      Download STL
    </button>
  );
};
