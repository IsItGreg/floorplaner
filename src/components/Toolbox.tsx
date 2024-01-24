import {
  AddCircle,
  AddBox,
  PanToolAlt,
  PanTool,
  Anchor,
  DoorFront,
  Window,
} from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { CanvasActions, GlobalContext } from "./GlobalContext";
import { ToolMode } from "./GlobalContext";

export const Toolbox = () => {
  const { state, dispatch } = React.useContext(GlobalContext);

  return (
    <div className="absolute top-3 ml-4 flex flex-col gap-2">
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
        <ToggleButton value={ToolMode.CREATE_DOOR}>
          <DoorFront />
        </ToggleButton>
        <ToggleButton value={ToolMode.CREATE_WINDOW}>
          <Window />
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        className="bg-white"
        orientation="vertical"
        value={state.snapRooms ? ["snap_on"] : []}
      >
        <ToggleButton
          onClick={() => {
            dispatch({ type: CanvasActions.TOGGLE_SNAP_ROOMS });
          }}
          value={"snap_on"}
        >
          <Anchor />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};
