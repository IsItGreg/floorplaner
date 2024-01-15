import { AddCircle, AddBox, PanToolAlt, PanTool } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { CanvasActions, GlobalContext } from "./GlobalContext";
import { ToolMode } from "./GlobalContext";

export const Toolbox = () => {
  const { state, dispatch } = React.useContext(GlobalContext);

  return (
    <div className="absolute top-3 ml-4">
      <ToggleButtonGroup
        className="bg-white"
        orientation="vertical"
        value={state.mode}
        exclusive
        onChange={(_, mode) => {
          if (mode) {
            dispatch({ type: CanvasActions.CHANGE_MODE, mode });
          }
        }}
      >
        <ToggleButton value={ToolMode.NONE}>
          <PanToolAlt />
        </ToggleButton>
        <ToggleButton value={ToolMode.PAN}>
          <PanTool />
        </ToggleButton>
        {/* <ToggleButton value={Mode.CREATE_WALLS}>
          <AddCircle />
        </ToggleButton> */}
        <ToggleButton value={ToolMode.CREATE_ROOM}>
          <AddBox />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};
