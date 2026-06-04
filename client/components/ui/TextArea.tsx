import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full relative group">
        {label && <label className="text-xs uppercase tracking-widest font-bold text-white/50 group-focus-within:text-brand-500 transition-colors">{label}</label>}
        <div className="relative">
          <textarea
            className={cn(
              "flex min-h-[120px] w-full rounded-none border-b border-white/10 bg-transparent px-0 py-2 text-base text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 resize-y",
              error && "border-red-500 focus-visible:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          <div className="absolute bottom-1 left-0 h-[1px] w-0 bg-brand-500 transition-all duration-500 group-focus-within:w-full" />
        </div>
        {error && <span className="text-xs text-red-500 font-medium tracking-wide mt-1">{error}</span>}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

export { TextArea };
