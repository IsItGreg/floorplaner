import React from "react";
import Canvas from "./Canvas";
import EditPlanDial from "./EditPlanDial";
import { GlobalContextProvider } from "./GlobalContext";
import { Toolbox } from "./Toolbox";

export const Planner = () => {
  return (
    // <div className="flex flex-row ">
    //   <div className="w-64 flex-none"></div>
    <div className="h-full w-full">
      <GlobalContextProvider>
        <Canvas />
        {/* <EditPlanDial /> */}
        <Toolbox />
      </GlobalContextProvider>
    </div>
    // </div>
  );
};
