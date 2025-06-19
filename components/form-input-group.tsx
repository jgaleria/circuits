import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/error-message";

interface FormInputGroupProps extends React.ComponentPropsWithoutRef<typeof Input> {
  label: string;
  error?: string | null;
}

export function FormInputGroup({ label, error, id, ...props }: FormInputGroupProps): JSX.Element {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
      <ErrorMessage error={error} />
    </div>
  );
} 