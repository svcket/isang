"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Heading ────────────────────────────────────────────────────────
interface PanelHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const PanelHeading = ({ children, className }: PanelHeadingProps) => (
  <h3 className={cn(
    "text-[18px] font-bold text-neutral-900 tracking-tight",
    className
  )}>
    {children}
  </h3>
);

// ─── Divider ────────────────────────────────────────────────────────
export const PanelDivider = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full bg-neutral-100/80 my-8", className)} />
);

// ─── IconButton ─────────────────────────────────────────────────────
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType;
  variant?: "ghost" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  iconClassName?: string;
  label?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, variant = "white", size = "md", className, iconClassName, label, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-9 w-9",
      lg: "h-11 w-11",
    };

    const variantClasses = {
      ghost: "bg-transparent hover:bg-neutral-50 border-transparent",
      outline: "bg-transparent border-neutral-200 hover:bg-neutral-50",
      white: "bg-white border-neutral-200 shadow-sm hover:bg-neutral-50",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full border transition-all active:scale-[0.96] shrink-0",
          sizeClasses[size],
          variantClasses[variant],
          label && "w-auto px-4 gap-2 rounded-xl",
          className
        )}
        {...props}
      >
        <Icon className={cn("w-4 h-4 stroke-[2.2] text-neutral-900", iconClassName)} />
        {label && <span className="text-[13px] font-bold text-neutral-900 leading-none">{label}</span>}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";
