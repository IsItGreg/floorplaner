import { AddCircle, PanToolAlt } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export const Toolbox = () => {
  return (
    <div style={{ position: "absolute", marginLeft: 15, top: 10 }}>
      <ToggleButtonGroup
        style={{ backgroundColor: "white" }}
        orientation="vertical"
      >
        <ToggleButton value="select">
          <PanToolAlt />
        </ToggleButton>
        <ToggleButton value="add-wall">
          <AddCircle />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};
