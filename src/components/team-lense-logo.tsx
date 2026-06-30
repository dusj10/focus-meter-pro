import { cn } from "@/lib/utils";

interface TeamlenseLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export function TeamlenseLogo({
  className,
  iconClassName,
  textClassName,
  showText = true,
}: TeamlenseLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", iconClassName)}
        aria-label="Teamlense logo"
      >
        {/* Magnifying glass lens */}
        <circle
          cx="14"
          cy="14"
          r="10"
          fill="#E1F5EE"
          stroke="#1D9E75"
          strokeWidth="2"
        />
        {/* Three dots in a triangle pattern */}
        <circle cx="12" cy="12" r="1.5" fill="#1D9E75" />
        <circle cx="16" cy="12" r="1.5" fill="#1D9E75" />
        <circle cx="14" cy="16" r="1.5" fill="#1D9E75" />
        {/* Handle */}
        <line
          x1="21"
          y1="21"
          x2="26"
          y2="26"
          stroke="#1D9E75"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Handle end circle */}
        <circle cx="26" cy="26" r="2.5" fill="#1D9E75" />
      </svg>
      {showText && (
        <span
          className={cn("font-semibold whitespace-nowrap", textClassName)}
          style={{ fontSize: "18px", color: "#2C2C2A", lineHeight: 1.2 }}
        >
          Teamlense
        </span>
      )}
    </div>
  );
}
