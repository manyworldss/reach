import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  duotone?: boolean;
  strokeWidth?: number;
}

export default function Icon({
  name,
  size = 20,
  duotone = false,
  strokeWidth = 1.75,
  className = "",
  style,
  ...props
}: IconProps) {
  const fillOpacity = duotone ? 0.15 : 0;
  const fillVal = duotone ? "currentColor" : "none";

  // Render SVG paths depending on name
  const renderPaths = () => {
    switch (name) {
      case "caseload":
        return (
          <>
            {/* Soft user outline behind */}
            <path
              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <circle cx="9" cy="7" r="4" fill={fillVal} fillOpacity={fillOpacity} />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </>
        );
      case "trajectory":
        return (
          <>
            {/* Trajectory curve with a shaded area below it if duotone */}
            {duotone && (
              <path
                d="M2 18C6 18 9 6 18 6V20H2Z"
                fill="currentColor"
                fillOpacity={fillOpacity}
                stroke="none"
              />
            )}
            <path
              d="M2 18C6 18 9 6 18 6"
              fill="none"
              strokeLinecap="round"
            />
            <circle
              cx="18"
              cy="6"
              r="2.5"
              fill="currentColor"
              fillOpacity={duotone ? 1 : 0}
            />
          </>
        );
      case "assess":
        return (
          <>
            <rect
              x="3"
              y="4"
              width="18"
              height="16"
              rx="3"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <path d="M9 10h6" />
            <path d="M9 14h4" />
            <path d="M16 2v2" />
            <path d="M8 2v2" />
          </>
        );
      case "program":
        return (
          <>
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="3"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
            <circle cx="6" cy="6" r="1" fill="currentColor" />
            <circle cx="12" cy="6" r="1" fill="currentColor" />
            <circle cx="18" cy="6" r="1" fill="currentColor" />
          </>
        );
      case "activity":
        return (
          <>
            {duotone && (
              <path
                d="M22 12h-4l-3 9L9 3l-3 9H2v9h20Z"
                fill="currentColor"
                fillOpacity={fillOpacity / 2}
                stroke="none"
              />
            )}
            <path
              d="M2 12h4l3-9 6 18 3-9h4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "billing":
        return (
          <>
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="2.5"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <line x1="2" y1="10" x2="22" y2="10" />
            <circle cx="6" cy="15" r="1.5" fill="currentColor" />
            <line x1="14" y1="15" x2="18" y2="15" />
          </>
        );
      case "messages":
        return (
          <>
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              fill={fillVal}
              fillOpacity={fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "settings":
        return (
          <>
            <circle
              cx="12"
              cy="12"
              r="3"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "check":
        return (
          <path
            d="M20 6L9 17l-5-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "checkCircle":
        return (
          <>
            <circle
              cx="12"
              cy="12"
              r="10"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <path
              d="M9 12l2 2 4-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "flag":
        return (
          <>
            <path
              d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
              fill={fillVal}
              fillOpacity={fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="4" y1="22" x2="4" y2="15" />
          </>
        );
      case "plus":
        return (
          <path
            d="M12 5v14M5 12h14"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "arrowRight":
        return (
          <path
            d="M5 12h14M12 5l7 7-7 7"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "arrowLeft":
        return (
          <path
            d="M19 12H5M12 19l-7-7 7-7"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "arrowUpRight":
        return (
          <path
            d="M7 17L17 7M7 7h10v10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "search":
        return (
          <>
            <circle
              cx="11"
              cy="11"
              r="8"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
              strokeLinecap="round"
            />
          </>
        );
      case "play":
        return (
          <path
            d="M5 3l14 9-14 9V3z"
            fill={fillVal}
            fillOpacity={fillOpacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "trophy":
        return (
          <>
            <path
              d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 22h16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 2a6 6 0 0 1 6 6v3a6 6 0 0 1-12 0V8a6 6 0 0 1 6-6z"
              fill={fillVal}
              fillOpacity={fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "home":
        return (
          <>
            <path
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              fill={fillVal}
              fillOpacity={fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline points="9 22 9 12 15 12 15 22" />
          </>
        );
      case "dumbbell":
        return (
          <>
            {/* Hexagon weights on left and right */}
            <rect
              x="2"
              y="8"
              width="4"
              height="8"
              rx="1.5"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <rect
              x="18"
              y="8"
              width="4"
              height="8"
              rx="1.5"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="6" y1="9" x2="6" y2="15" />
            <line x1="18" y1="9" x2="18" y2="15" />
          </>
        );
      case "hand":
        return (
          <>
            {/* Elegant simplified hand vector */}
            <path
              d="M18 11V6a1.5 1.5 0 0 0-3 0v5m0-5V4.5a1.5 1.5 0 0 0-3 0V11m0-6.5V3a1.5 1.5 0 0 0-3 0v8M9 11V6a1.5 1.5 0 0 0-3 0v9c0 4.42 3.58 8 8 8h1c4.42 0 8-3.58 8-8v-3a1.5 1.5 0 0 0-3 0v2M2 13a4.5 4.5 0 0 0 4 4.4M2 13c1-2.5 3-3.5 4.5-3"
              fill={fillVal}
              fillOpacity={fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "x":
        return (
          <path
            d="M18 6L6 18M6 6l12 12"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "edit":
        return (
          <>
            <path
              d="M12 20h9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
              fill={fillVal}
              fillOpacity={fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "spark":
        return (
          <path
            d="M12 2s.5 7.5 4.5 9.5c.5.25.5.75 0 1C12.5 14.5 12 22 12 22s-.5-7.5-4.5-9.5c-.5-.25-.5-.75 0-1C11.5 9.5 12 2 12 2z"
            fill={fillVal}
            fillOpacity={fillOpacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "clock":
        return (
          <>
            <circle
              cx="12"
              cy="12"
              r="10"
              fill={fillVal}
              fillOpacity={fillOpacity}
            />
            <polyline
              points="12 6 12 12 16 14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "bell":
        return (
          <>
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z"
              fill={fillVal}
              fillOpacity={fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "chevronRight":
        return (
          <path
            d="M9 18l6-6-6-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={`reach-icon ${className}`}
      style={style}
      {...props}
    >
      {renderPaths()}
    </svg>
  );
}
