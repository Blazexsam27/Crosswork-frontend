import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function useToast() {
  const toast = ({ title, description, variant, duration }: ToastOptions) => {
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
        duration: duration || 5000,
      });
    }

    return sonnerToast.success(title, {
      description,
      duration: duration || 5000,
    });
  };

  return { toast };
}
