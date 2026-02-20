"use client";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

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
