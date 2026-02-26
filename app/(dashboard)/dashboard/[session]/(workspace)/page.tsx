import ProjectsList from "@/components/projects/list";
import ProjectsProvider from "@/components/projects/list/provider";
import { ProjectsQuery } from "@/convex/query.config";
import React from "react";

const page = async () => {
  const { projects, profile } = await ProjectsQuery();

  return (
    <ProjectsProvider initialProjects={projects}>
      <div className="container mx-auto py-36">
        <ProjectsList />
      </div>
    </ProjectsProvider>
  );
};

export default page;
