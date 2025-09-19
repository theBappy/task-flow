"use client";

import { Button } from "@/components/ui/button";
import { ProjectLogo } from "@/features/projects/components/project-logo";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { useProjectId } from "@/features/tasks/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { PageLoader } from "@/components/custom/page-loader";
import { PageError } from "@/components/custom/page-error";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/custom/analytics";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });
  const isLoading = isLoadingAnalytics || isLoadingProject;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectLogo
            className="size-8"
            image={project?.imageUrl}
            name={project?.name}
          />
          <p className="text-lg font-semibold">{project?.name}</p>
        </div>
        <div className="">
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <Pencil className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics ? <Analytics data={analytics} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
