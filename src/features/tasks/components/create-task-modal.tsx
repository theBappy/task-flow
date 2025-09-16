"use client"

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";

export const CreateTaskModal = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <div className="">
        <CreateTaskFormWrapper onCancel={close} />
      </div>
    </ResponsiveModal>
  );
};
