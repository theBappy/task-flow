"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface ProjectLogoProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectLogo: React.FC<ProjectLogoProps > = ({
  image,
  name,
  className,
  fallbackClassName,
}) => {
  const fallbackInitial = name?.[0]?.toUpperCase() ?? "?";

  if (image) {
    return (
      <div
        className={cn(
          "size-8 relative rounded-md overflow-hidden border border-neutral-200 shadow-sm",
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
        "size-8 rounded-md border border-neutral-200 shadow-sm",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "text-white font-semibold text-lg uppercase rounded-md",
          "bg-gradient-to-br from-blue-500 to-indigo-600",
          fallbackClassName
        )}
      >
        {fallbackInitial}
      </AvatarFallback>
    </Avatar>
  );
};
