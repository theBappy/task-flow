import { ProjectLogo } from "@/features/projects/components/project-logo";
import { Project } from "@/features/projects/types";
import { Task } from "@/features/tasks/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import { useConfirm } from "@/features/workspaces/hooks/use-confirm";
import { useRouter } from "next/navigation";

interface Props {
  project: Project;
  task: Task;
}

export const TaskBreadCrumbs = ({ project, task }: Props) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useDeleteTask();
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This cannot be undone.",
    "destructive"
  );
  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectLogo
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        className="ml-auto"
        variant="destructive"
        onClick={handleDeleteTask}
        disabled={isPending}
        size="sm"
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};
