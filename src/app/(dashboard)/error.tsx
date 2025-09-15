"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-y-4 text-muted-foreground">
      <AlertTriangle className="size-6" />
      <p className="text-sm text-muted-foreground">Something went wrong</p>
      <Button asChild variant="secondary" size="sm">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
