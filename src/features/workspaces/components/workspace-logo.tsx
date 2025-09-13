"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface WorkspaceLogoProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceLogo: React.FC<WorkspaceLogoProps> = ({
  image,
  name,
  className,
}) => {
  const fallbackInitial = name?.[0]?.toUpperCase() ?? "?";

  if (image) {
    return (
      <div
        className={cn(
          "size-10 relative rounded-md overflow-hidden border border-neutral-200 shadow-sm",
          className
        )}
      >
        <Image
          src={image}
          alt={name || "Workspace Logo"}
          width={40}
          height={40}
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <Avatar
      className={cn(
        "size-10 rounded-md border border-neutral-200 shadow-sm",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "text-white font-semibold text-lg uppercase rounded-md",
          "bg-gradient-to-br from-blue-500 to-indigo-600"
        )}
      >
        {fallbackInitial}
      </AvatarFallback>
    </Avatar>
  );
};
