import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-800",
      primary: "bg-honey-gold/10 text-honey-gold border border-honey-gold/20",
      secondary:
        "bg-warm-orange/10 text-warm-orange border border-warm-orange/20",
      success: "bg-green-100 text-green-800 border border-green-200",
      danger: "bg-red-100 text-red-800 border border-red-200",
      warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
