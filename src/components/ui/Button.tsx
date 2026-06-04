"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "success" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-accent to-accent-hover text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)]",
  secondary:
    "bg-surface text-accent border border-border shadow-sm hover:border-accent hover:bg-accent-light",
  ghost: "bg-transparent text-text hover:bg-slate-100",
  inverse: "bg-white text-accent shadow-sm hover:bg-slate-50",
  success:
    "bg-green-100 text-green-800 border border-green-200 shadow-sm hover:bg-green-200/80",
  danger: "bg-red-100 text-red-800 border border-red-200 shadow-sm hover:bg-red-200/80",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-6 py-3 text-[0.9375rem]",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-55 active:translate-y-px",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
