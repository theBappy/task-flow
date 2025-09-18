"use client";

import { useGetSingleTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { PageLoader } from "@/components/custom/page-loader";
import { PageError } from "@/components/custom/page-error";
import { TaskBreadCrumbs } from "@/components/custom/task-breadcrumbs";
import { DottedSeparator } from "@/components/custom/dotted-separator";
import { TaskOverview } from "@/components/custom/task-overview";
import { TaskDescription } from "@/components/custom/task-description";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetSingleTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadCrumbs task={data} project={data.project} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};
