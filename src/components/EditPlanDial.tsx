import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useContext } from "react";
import { CanvasActions, GlobalContext } from "./GlobalContext";

const EditPlanDial = () => {
  const { dispatch } = useContext(GlobalContext);

  return (
    <SpeedDial
      ariaLabel={"Add new"}
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      <SpeedDialAction
        onClick={() => {
          dispatch({ type: CanvasActions.CREATE_WALLS });
        }}
        icon={<CreateIcon />}
        tooltipTitle="New Wall"
      />
    </SpeedDial>
  );
};

export default EditPlanDial;
