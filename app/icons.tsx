import type { ComponentType, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string };
export type LucideIcon = ComponentType<IconProps>;

function paths(name: string) {
  switch (name) {
    case "activity": return <><path d="M3 12h4l2.5-7 5 14 2.5-7h4" /></>;
    case "alert": return <><path d="M10.3 3.7 2.5 17.2A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.8L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>;
    case "bars": return <><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></>;
    case "boxes": return <><path d="m12 2 4 2.2v4.6L12 11 8 8.8V4.2Z" /><path d="m6 12 4 2.2v4.6L6 21l-4-2.2v-4.6Z" /><path d="m18 12 4 2.2v4.6L18 21l-4-2.2v-4.6Z" /></>;
    case "gauge": return <><path d="M4.9 19a9 9 0 1 1 14.2 0" /><path d="m12 13 4-4" /><path d="M12 19v.01" /></>;
    case "code": return <><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" /></>;
    case "cpu": return <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>;
    case "database": return <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3 1.1 0 2.2-.1 3-.3" /><path d="m18 15-2 3h3l-2 4" /></>;
    case "external": return <><path d="M15 3h6v6" /><path d="m10 14 11-11" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>;
    case "download": return <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>;
    case "file-search": return <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7" /><path d="M14 2v6h6" /><circle cx="16" cy="16" r="3" /><path d="m18.5 18.5 2.5 2.5" /></>;
    case "flask": return <><path d="M9 3h6" /><path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M7.5 16h9" /></>;
    case "branch": return <><circle cx="6" cy="4" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="20" r="2" /><path d="M6 6v12" /><path d="M8 8c4 0 4-2 8-2" /></>;
    case "key": return <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9" /><path d="m15 8 3 3" /><path d="m17 6 3 3" /></>;
    case "link": return <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1" /></>;
    case "lock": return <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></>;
    case "menu": return <><path d="M4 6h16M4 12h16M4 18h16" /></>;
    case "monitor": return <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>;
    case "moon": return <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z" />;
    case "package": return <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" /><path d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v9" /><circle cx="18" cy="18" r="3" /><path d="m20.2 20.2 1.8 1.8" /></>;
    case "scan": return <><path d="M3 7V4a1 1 0 0 1 1-1h3M17 3h3a1 1 0 0 1 1 1v3M21 17v3a1 1 0 0 1-1 1h-3M7 21H4a1 1 0 0 1-1-1v-3" /><circle cx="11" cy="11" r="4" /><path d="m14 14 4 4" /></>;
    case "settings": return <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>;
    case "shield-alert": return <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="M12 8v4M12 16h.01" /></>;
    case "shield-check": return <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>;
    case "sun": return <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>;
    case "user-check": return <><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a6 6 0 0 1 6-6h2" /><path d="m15 18 2 2 4-5" /></>;
    case "wrench": return <><path d="M14.7 6.3a4 4 0 0 0-5-5L7.4 3.6l3 3-3.8 3.8-3-3-2.3 2.3a4 4 0 0 0 5 5L17 4" /><path d="m13 11 8 8-2 2-8-8" /></>;
    case "x": return <path d="M18 6 6 18M6 6l12 12" />;
    default: return <circle cx="12" cy="12" r="9" />;
  }
}

function createIcon(name: string): LucideIcon {
  return function Icon({ size = 24, strokeWidth = 2, ...props }: IconProps) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>{paths(name)}</svg>;
  };
}

export const Activity = createIcon("activity");
export const AlertTriangle = createIcon("alert");
export const BarChart3 = createIcon("bars");
export const Boxes = createIcon("boxes");
export const CircleGauge = createIcon("gauge");
export const CodeXml = createIcon("code");
export const Cpu = createIcon("cpu");
export const DatabaseZap = createIcon("database");
export const ExternalLink = createIcon("external");
export const FileDown = createIcon("download");
export const FileSearch = createIcon("file-search");
export const FlaskConical = createIcon("flask");
export const GitBranch = createIcon("branch");
export const KeyRound = createIcon("key");
export const Link2 = createIcon("link");
export const LockKeyhole = createIcon("lock");
export const Menu = createIcon("menu");
export const Monitor = createIcon("monitor");
export const Moon = createIcon("moon");
export const PackageSearch = createIcon("package");
export const ScanSearch = createIcon("scan");
export const Settings2 = createIcon("settings");
export const ShieldAlert = createIcon("shield-alert");
export const ShieldCheck = createIcon("shield-check");
export const Sun = createIcon("sun");
export const UserRoundCheck = createIcon("user-check");
export const Wrench = createIcon("wrench");
export const X = createIcon("x");
