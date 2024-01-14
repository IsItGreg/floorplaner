import React from "react";
import { DownloadSTLButton } from "./DownloadSTLButton";

export const Sidebar = () => {
  return (
    <div className="flex h-full w-64 flex-shrink-0 flex-col bg-slate-800">
      <h1 className="mt-10 text-center text-3xl font-bold text-slate-200">
        Floor Plan App
      </h1>
      <DownloadSTLButton />
    </div>
  );
};
