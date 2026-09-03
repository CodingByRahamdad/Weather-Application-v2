import { useLocation, useNavigate } from "react-router-dom";
import {
  Cloud,
  Home,
  Star,
  Clock,
  LayoutGrid,
  Menu,
  PanelLeftClose,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

const NAV = [
  { path: "/weather", label: "Dashboard", icon: Home },
  { path: "/favorites", label: "Favorites", icon: Star },
  { path: "/history", label: "History", icon: Clock },
  { path: "/statistics", label: "Statistics", icon: LayoutGrid },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar({ open, onClose, collapsed, onToggleCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useApp();

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      ) : null}

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-[#E1E6ED]/45 bg-white/90 px-3 py-5 backdrop-blur-xl",
          "transition-[width,transform,padding] duration-300 ease-out motion-reduce:transition-none",
          "dark:border-ink-600/30 dark:bg-ink-900/90",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          collapsed ? "lg:w-[76px]" : "lg:w-56",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className={cn("flex items-center justify-between gap-3", collapsed && "lg:justify-center")}>
          {/* Brand — hidden on desktop when collapsed */}
          <div className={cn("flex min-w-0 items-center gap-3", collapsed && "lg:hidden")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-accent-400 text-ink-950 shadow-[0_5px_18px_-10px_rgba(45,212,191,0.45)]">
              <Cloud className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ink-900 dark:text-ink-50 leading-tight">Halcyon</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-400">Weather Intel</p>
            </div>
          </div>

          {collapsed ? (
            /* Collapsed (desktop): hamburger lives inside the rail to reopen */
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="hidden h-10 w-10 items-center justify-center rounded-[14px] border border-[#E1E6ED]/45 bg-white/60 text-ink-500 transition-colors hover:bg-white hover:text-ink-800 dark:border-ink-600/30 dark:bg-ink-800/60 dark:text-ink-300 dark:hover:bg-ink-700 lg:flex"
              aria-label="Expand sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              {/* Expanded (desktop): collapse control inside the sidebar */}
              <button
                type="button"
                onClick={onToggleCollapsed}
                className="hidden h-8 w-8 items-center justify-center rounded-[12px] text-ink-400 transition-colors hover:bg-ink-100/70 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-ink-200 lg:flex"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
              {/* Mobile drawer close */}
              <button
                type="button"
                className="rounded-[12px] p-1.5 text-ink-400 hover:bg-ink-100/70 dark:hover:bg-ink-800 lg:hidden"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                title={collapsed ? item.label : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={cn(
                  "group flex min-h-10 items-center rounded-[16px] text-sm transition-[background-color,color,border-color,padding] duration-200",
                  collapsed ? "gap-3 px-3 lg:gap-0 lg:justify-center lg:px-0" : "gap-3 px-3",
                  active
                    ? "bg-accent-400/10 text-accent-500 dark:text-accent-300 border border-accent-400/20"
                    : "text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-50 border border-transparent",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className={cn("font-medium", collapsed && "lg:hidden")}>{item.label}</span>
                {item.path === "/favorites" && favorites.length > 0 ? (
                  <span className={cn("ml-auto rounded-full bg-accent-400/20 px-2 py-0.5 text-[10px] font-medium text-accent-500 dark:text-accent-300", collapsed && "lg:hidden")}>
                    {favorites.length}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className={cn(
          "mt-4 flex items-center gap-3 rounded-[18px] border border-[#E1E6ED]/45 bg-white/45 p-3 dark:border-ink-600/30 dark:bg-ink-800/40",
          collapsed && "lg:justify-center lg:p-2",
        )}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-orange-500 text-xs font-semibold text-white">
            AH
          </div>
          <div className={cn("min-w-0", collapsed && "lg:hidden")}>
            <p className="text-sm font-medium text-ink-900 dark:text-ink-50 leading-tight">Amelia H.</p>
            <p className="text-xs text-ink-400">Free plan</p>
          </div>
        </div>
      </aside>
    </>
  );
}
