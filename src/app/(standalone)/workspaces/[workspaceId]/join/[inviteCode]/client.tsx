"use client";

import { PageError } from "@/components/custom/page-error";
import { PageLoader } from "@/components/custom/page-loader";

import { useSingleGetWorkspaceInfo } from "@/features/workspaces/api/use-get-single-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspaceIdJoinJoinClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading } = useSingleGetWorkspaceInfo({
    workspaceId,
  });

  if (isLoading) {
    return <PageLoader />;
  }
  if (!initialValues) {
    return <PageError message="Project not found" />;
  }
  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
};
