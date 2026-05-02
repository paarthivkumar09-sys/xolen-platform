import { CheckCircle } from "lucide-react";

interface XolenBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export function XolenBadge({ size = "sm", className = "" }: XolenBadgeProps) {
  const isSmall = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 ring-1 ring-emerald-200 ${
        isSmall ? "text-[11px]" : "text-xs"
      } ${className}`}
    >
      <CheckCircle
        className={isSmall ? "h-3 w-3" : "h-3.5 w-3.5"}
        strokeWidth={2.5}
      />
      XOLEN Verified
    </span>
  );
}
