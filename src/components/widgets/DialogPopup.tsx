// components/ui/custom-dialog.tsx
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { ReactNode } from "react";

interface CustomDialogProps {
  triggerText?: string;
  triggerVariant?: any;
  triggerAsChild?: boolean;
  triggerStyles?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footerContent?: ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function CustomDialog({
  triggerText = "Open",
  triggerVariant = "outline",
  triggerStyles = "",
  triggerAsChild = false,
  title,
  description,
  children,
  footerContent,
  onOpenChange,
}: CustomDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild={triggerAsChild}>
        {triggerAsChild ? (
          children
        ) : (
          <Button className={triggerStyles} variant={triggerVariant}>
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        <DialogFooter className="sm:justify-start flex">
          {footerContent || (
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
