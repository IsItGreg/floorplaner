import {
  AddCircle,
  AddBox,
  PanToolAlt,
  PanTool,
  Anchor,
  DoorFront,
  Backspace,
  RollerShades,
} from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import React from "react";
import { CanvasActions, GlobalContext } from "./GlobalContext";
import { ToolMode } from "./GlobalContext";

export const Toolbox = () => {
  const { state, dispatch } = React.useContext(GlobalContext);

  return (
    <div className="absolute top-3 ml-4 flex flex-col gap-2">
      <ToggleButtonGroup
        className="bg-white shadow"
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
          <Tooltip title="Create room" arrow placement="right">
            <AddBox />
          </Tooltip>
        </ToggleButton>

        <ToggleButton value={ToolMode.CREATE_DOOR}>
          <Tooltip title="Create door" arrow placement="right">
            <DoorFront />
          </Tooltip>
        </ToggleButton>

        <ToggleButton value={ToolMode.CREATE_WINDOW}>
          <Tooltip title="Create window" arrow placement="right">
            <RollerShades />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        className="bg-white shadow"
        orientation="vertical"
        value={state.snapRooms ? ["snap_on"] : []}
      >
        <ToggleButton
          onClick={() => {
            dispatch({ type: CanvasActions.TOGGLE_SNAP_ROOMS });
          }}
          value={"snap_on"}
        >
          <Tooltip
            title="Toggle snapping (hold shift to temporarily reverse)"
            arrow
            placement="right"
          >
            <Anchor />
          </Tooltip>
        </ToggleButton>

        <ToggleButton
          value={"delete_corner"}
          disabled={state.selectedCorner === null}
          onClick={() => {
            dispatch({ type: CanvasActions.DELETE_SELECTED_CORNER });
          }}
        >
          <Tooltip
            title="Delete selected corner and attached box"
            arrow
            placement="right"
          >
            <Backspace />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};
