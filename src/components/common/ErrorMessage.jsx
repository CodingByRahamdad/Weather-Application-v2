import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "./Button";

export function ErrorMessage({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[24px] border border-error/15 bg-error/8 p-4 shadow-[0_8px_28px_-20px_rgba(248,113,113,0.3)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-error" />
        <div>
          <p className="font-medium text-ink-900 dark:text-ink-50">{title}</p>
          <p className="text-sm text-ink-500 dark:text-ink-300">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button size="sm" variant="outline" leftIcon={<RotateCw className="h-3.5 w-3.5" />} onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
