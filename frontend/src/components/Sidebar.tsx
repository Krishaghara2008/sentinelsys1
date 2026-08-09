import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
  History,
  Info,
  LayoutGrid,
  ScanSearch,
  Settings,
  Waves,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/analysis", label: "System Analysis", icon: ScanSearch },
  { to: "/rules", label: "Fuzzy Rules", icon: Waves },
  { to: "/history", label: "History", icon: History },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/about", label: "About SentinelSys", icon: Info },
];

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed z-40 flex h-full flex-col border-r border-line bg-panel transition-all duration-200 md:sticky md:top-0
          ${collapsed ? "md:w-[76px]" : "md:w-60"}
          ${mobileOpen ? "left-0 w-64" : "-left-64 md:left-0"}`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-line px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cyan/10 shadow-glow">
            <Activity size={17} className="text-cyan" strokeWidth={2.25} />
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-sm font-semibold tracking-wide text-ink">
                SentinelSys
              </p>
              <p className="truncate text-[10px] uppercase tracking-widest text-ink-faint">
                Fuzzy Logic Advisor
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-cyan/10 text-cyan shadow-glow"
                    : "text-ink-muted hover:bg-panel-raised hover:text-ink"
                }`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={17} strokeWidth={2} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={onToggle}
          className="hidden items-center justify-center gap-2 border-t border-line py-3 text-ink-faint hover:text-ink md:flex"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
}
