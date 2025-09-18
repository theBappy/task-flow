"use client";

import { PageError } from "@/components/custom/page-error";
import { PageLoader } from "@/components/custom/page-loader";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useSingleGetWorkspace } from "@/features/workspaces/api/use-get-single-workspace";

export const WorkspaceIdSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading } = useSingleGetWorkspace({workspaceId});

  if (isLoading) {
    return <PageLoader />;
  }
  if (!initialValues) {
    return <PageError message="Project not found" />;
  }
  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};
