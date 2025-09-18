import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ProjectLogo } from "@/features/projects/components/project-logo";
import { getProject } from "@/features/projects/queries";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

interface ProjectIdPageProps {
  params: { projectId: string };
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({
    projectId: params.projectId,
  });

  if (!initialValues) {
    throw new Error("Project not found");
  }

  const href = `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectLogo
            className="size-8"
            image={initialValues?.imageUrl}
            name={initialValues?.name}
          />
          <p className="text-lg font-semibold">{initialValues?.name}</p>
        </div>
        <div className="">
          <Button variant="secondary" size="sm" asChild>
            <Link href={href}>
              <Pencil className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default ProjectIdPage;
