import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-display uppercase tracking-widest font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 disabled:opacity-30 disabled:pointer-events-none relative overflow-hidden group",
          {
            "bg-brand-500 text-bg-base hover:bg-brand-400 hover:shadow-[0_0_30px_rgba(255,68,0,0.6)]": variant === "primary",
            "bg-transparent text-white border border-white/10 hover:border-brand-500/50 hover:bg-brand-500/5": variant === "secondary",
            "bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]": variant === "danger",
            "bg-transparent text-white/60 hover:text-white": variant === "ghost",
            "h-10 px-6 text-xs": size === "sm",
            "h-12 px-8 text-sm": size === "md",
            "h-16 px-10 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
