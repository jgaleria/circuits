import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-circuits-dark-blue focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-circuits-dark-blue text-white shadow hover:bg-circuits-medium-blue",
        secondary:
          "border-transparent bg-circuits-medium-blue text-white hover:bg-circuits-dark-blue",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-circuits-dark-blue bg-circuits-light-grey border-circuits-light-grey",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
