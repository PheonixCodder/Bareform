import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, LayoutIcon, Type } from "lucide-react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const tabs = [
  {
    value: "colors",
    label: "Colors",
    icon: Hash,
  },
  {
    value: "typography",
    label: "Typography",
    icon: Type,
  },
  {
    value: "moodboard",
    label: "Moodboard",
    icon: LayoutIcon,
  },
] as const;

const layout = ({ children }: Props) => {
  return (
    <Tabs defaultValue="colors" className="w-full">
      <div className="mt-36 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-left text-center font-bold text-foreground">
                Style Guide
              </h1>
              <p className="text-muted-foreground mt-2 text-center lg:text-left">
                Manage your style guide for your project.
              </p>
            </div>
            <TabsList className="px-2 gap-2 w-full sm:w-auto h-max! rounded-full backdrop-blur-xl bg-white/10 border border-white/20 justify-items-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex py-1 items-center justify-center rounded-full w-min! gap-2 text-xs sm:text-sm transition-all! duration-200 data-[state=active]:bg-white/20! data-[state=active]:border! data-[state=active]:border-white/30!"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </div>
    </Tabs>
  );
};

export default layout;
