import React from "react";
import "../App.css";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import EditPlanDial from "./EditPlanDial";
import { GlobalContextProvider } from "./GlobalContext";

export const Planner = () => {
  return (
    <div className="flex flex-row">
      <div className="w-64 flex-none">
        <div className="flex flex-col space-y-3 p-3">
          <Sidebar />
          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => setMode(Mode.CreateWalls)}
          >
            New wall
          </Button> */}
        </div>
      </div>
      <div>
        <GlobalContextProvider>
          <Canvas />
          <EditPlanDial />
        </GlobalContextProvider>
      </div>
    </div>
  );
};
