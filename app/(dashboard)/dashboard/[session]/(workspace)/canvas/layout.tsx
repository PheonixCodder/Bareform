import Toolbar from "@/components/canvas/toolbar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-screen">
      {children}
      <Toolbar />
    </div>
  );
};

export default layout;
