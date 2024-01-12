import React from "react";
import { Planner } from "./components/PlannerV2";
import { Sidebar } from "./components/Sidebar";

export const App = () => {
  return (
    <div className="flex h-screen w-screen flex-row overflow-hidden">
      <Sidebar />
      <Planner />
    </div>
  );
};
