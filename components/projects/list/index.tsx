"use client";

import { useProjectCreation } from "@/hooks/use-project";
import { useAppSelector } from "@/redux/store";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DataModel } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";

const ProjectsList = () => {
  const { projects, canCreate } = useProjectCreation();
  const user = useAppSelector((state) => state.profile);

  return (
    <div className="space-y-8 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Your Projects
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
            Manage your design projects and continue where you left off.
          </p>
        </div>
        {/* Optional: Add a "New Project" button here for better UX */}
      </div>

      {projects.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-xl border-muted">
          <div className="w-16 h-16 mb-4 rounded-lg bg-muted flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            No projects yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
            Create your first project to get started with your designs.
          </p>
          {/* Action Button could go here */}
        </div>
      ) : (
        /* Responsive Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
          {projects.map((project: DataModel["projects"]["document"]) => (
            <Link
              key={project._id}
              href={`/dashboard/${user?.name}/canvas?project=${project._id}`}
              className="group cursor-pointer block"
            >
              <div className="space-y-3">
                {/* Thumbnail Container */}
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted relative ring-1 ring-border group-hover:ring-primary/50 transition-all">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Edited
                    {formatDistanceToNow(new Date(project.lastModified), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
