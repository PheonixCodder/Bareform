"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { CircleQuestionMark, Hash, LayoutTemplate, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { CreateProject } from "../buttons/project";
import Autosave from "../canvas/autosave";

type TabProps = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export const Navbar = () => {
  const params = useSearchParams();
  const projectId = params.get("project");
  const pathname = usePathname();
  const hasCanvas = pathname.includes("canvas");
  const hasStyleGuide = pathname.includes("style-guide");
  const me = useAppSelector((state) => state.profile);

  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip",
  );

  const creditBalance = useQuery(api.subscription.getCreditsBalance, {
    userId: me.id as Id<"users">,
  });

  if (!me) {
    return null;
  }
  const tabs: TabProps[] = [
    {
      label: "Canvas",
      href: `/dashboard/${me.name}/canvas?project=${projectId}`,
      icon: <Hash className="h-4 w-4" />,
    },
    {
      label: "Style Guide",
      href: `/dashboard/${me.name}/style-guide?project=${projectId}`,
      icon: <LayoutTemplate className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex p-4 lg:px-6 fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between backdrop-blur-sm">
      {/* Left: Project Logo */}
      <div className="flex items-center gap-4 justify-start">
        <Link
          href={`/dashboard/${me.name}`}
          className="w-8 h-8 rounded-full border-2 border-white bg-black flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-white"></div>
        </Link>
        {(!hasCanvas || !hasStyleGuide) && (
          <div className="hidden lg:block text-sm text-primary/80 truncate font-medium">
            Project / <span className="text-white">{project?.name}</span>
          </div>
        )}
      </div>

      {/* Middle: Navigation Tabs */}
      <div className="hidden items-center justify-center md:flex">
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-4xl border border-border">
          {tabs.map((tab) => {
            const isActive = pathname.includes(
              tab.label.toLowerCase().replace(" ", "-"),
            );
            return (
              <Link key={tab.label} href={tab.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-8 px-4 flex items-center gap-2 transition-all rounded-4xl",
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "text-muted-foreground hover:text-white",
                  )}
                >
                  {tab.icon}
                  <span className="text-xs font-medium">{tab.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 justify-end">
        <span className="text-xs text-white/40 inline">{creditBalance} credits</span>
        <Button
          variant="secondary"
          className="rounded-full size-10 flex items-center justify-center backdrop-blur-xl bg-white/8 border border-white/12 hover:bg-white/12"
        >
          <CircleQuestionMark className="size-5 text-white" />
        </Button>
        <Avatar className="size-10">
          <AvatarImage src={me.image || ""} />
          <AvatarFallback>
            <User className="size-5 text-white" />
          </AvatarFallback>
        </Avatar>
        {hasCanvas && <Autosave />}
        {!hasCanvas && !hasStyleGuide && <CreateProject />}
      </div>
    </div>
  );
};
