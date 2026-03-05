"use client";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Heart, Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GenaralSubmitButtonProps {
  text: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  width?: string;
  icon?: ReactNode;
}

export function GenaralSubmitButton({
  text,
  variant,
  width,
  icon,
}: GenaralSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button variant={variant} className={width} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          {icon && <div>{icon}</div>}
          <span>{text} </span>
        </>
      )}
    </Button>
  );
}

export function SaveJobButton({ saveJob }: { saveJob: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Heart
            className={cn(
              saveJob ? "fill-current text-red-500" : "",
              "size-4 transition-colors",
            )}
          />
          {saveJob ? "Saved" : "Save Job"}
        </>
      )}
    </Button>
  );
}
