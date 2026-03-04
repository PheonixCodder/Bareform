"use client";
import { loadProject } from "@/redux/slices/shapes";
import { restoreViewport } from "@/redux/slices/viewport";
import { useAppDispatch } from "@/redux/store";
import { preloadedQueryResult } from "convex/nextjs";
import { useEffect } from "react";

type Props = { children: React.ReactNode; initialProject: unknown };

const ProjectProvider = ({ children, initialProject }: Props) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const project = preloadedQueryResult(
      initialProject as Parameters<typeof preloadedQueryResult>[0],
    );
    // Load the sketches data into the shapes Redux state
    dispatch(loadProject(project.sketchesData));

    // Restore viewport position if available
    if (project.viewportData) {
      dispatch(restoreViewport(project.viewportData));
    }
  }, [dispatch, initialProject]);

  return <>{children}</>;
};

export default ProjectProvider;
