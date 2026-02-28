"use client";
import { fetchProjectsSuccess } from "@/redux/slices/projects";
import { useAppDispatch } from "@/redux/store";
import { preloadedQueryResult } from "convex/nextjs";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  initialProjects: any;
};

const ProjectsProvider = ({ children, initialProjects }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const projects = preloadedQueryResult(initialProjects);
    if (projects) {
      dispatch(
        fetchProjectsSuccess({
          projects: projects,
          total: projects.length,
        }),
      );
    }
  }, [dispatch, initialProjects]);

  return <>{children}</>;
};

export default ProjectsProvider;
