"use client";

import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { WorkspaceLogo } from "@/features/workspaces/components/workspace-logo";

export const WorkspaceSwitcher = () => {
  const { data: workspaces } = useGetWorkspace();
  console.log(workspaces)
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <Select>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem value={workspace.$id} key={workspace.$id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceLogo
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
