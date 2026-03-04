import InfiniteCanvas from "@/components/canvas";
import ProjectProvider from "@/components/projects/provider";
import { ProjectQuery } from "@/convex/query.config";
import React from "react";

interface CanvasPageProps {
  searchParams: Promise<{ project?: string }>;
}

const Page = async ({ searchParams }: CanvasPageProps) => {
  const params = await searchParams;
  const projectId = params.project;
  if (!projectId) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No project selected</p>
      </div>
    );
  }

  const queryResult = await ProjectQuery(projectId).catch(() => null);
  if (!queryResult) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Unable to load project</p>
      </div>
    );
  }
  const { project } = queryResult;

  return (
    <ProjectProvider initialProject={project}>
      <InfiniteCanvas />
    </ProjectProvider>
  );
};

export default Page;
