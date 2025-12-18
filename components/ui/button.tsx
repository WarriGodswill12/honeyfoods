import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 tracking-wide";

    const variants = {
      primary:
        "bg-honey-gold text-white hover:opacity-90 active:scale-[0.98] rounded-full shadow-sm hover:shadow-md",
      secondary:
        "bg-charcoal-black text-white hover:opacity-90 active:scale-[0.98] rounded-full",
      outline:
        "border border-charcoal-black text-charcoal-black hover:bg-charcoal-black hover:text-white active:scale-[0.98] rounded-full",
      ghost:
        "text-charcoal-black hover:text-honey-gold active:scale-[0.98] underline-offset-4 hover:underline",
      danger:
        "bg-red-500 text-white hover:opacity-90 active:scale-[0.98] rounded-full",
    };

    const sizes = {
      sm: "px-5 py-2 text-sm",
      md: "px-7 py-3 text-base",
      lg: "px-10 py-4 text-lg",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
