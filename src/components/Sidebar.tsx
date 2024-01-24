import React from "react";
import { DownloadSTLButton } from "./DownloadSTLButton";

export const Sidebar = () => {
  return (
    <div className="flex h-full w-64 flex-shrink-0 flex-col bg-slate-800">
      <h1 className="mt-10 text-center text-3xl font-bold text-slate-200">
        FLAURD
      </h1>
      <h2 className="mx-5 mt-2 text-center text-lg text-slate-200">
        Flexible Layouts And Unrestricted Room Design
      </h2>
      <DownloadSTLButton />
    </div>
  );
};
