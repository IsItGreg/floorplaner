import { AddCircle, PanToolAlt } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { CanvasActions, GlobalContext } from "./GlobalContext";
import { Mode } from "./GlobalContext";

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
        <ToggleButton value={Mode.NONE}>
          <PanToolAlt />
        </ToggleButton>
        <ToggleButton value={Mode.CREATE_WALLS}>
          <AddCircle />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};
