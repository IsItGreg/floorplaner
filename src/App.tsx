import React from "react";
import { Planner } from "./components/PlannerV2";
import { Sidebar } from "./components/Sidebar";
import { GlobalContextProvider } from "./components/GlobalContext";

export const App = () => {
  return (
    <GlobalContextProvider>
      <div className="flex h-screen w-screen flex-row overflow-hidden">
        <Sidebar />
        <Planner />
      </div>
    </GlobalContextProvider>
  );
};
