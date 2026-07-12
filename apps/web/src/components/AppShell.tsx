import {
  BarChart3,
  ClipboardList,
  FileText,
  Home,
  LifeBuoy,
  Settings,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { PropsWithChildren } from "react";
import type { DataMode, ViewKey } from "../App.js";
import { Logo } from "./Logo.js";

interface AppShellProps extends PropsWithChildren {
  view: ViewKey;
  notice: string;
  dataMode: DataMode;
  onDataModeChange: (mode: DataMode) => void;
  onViewChange: (view: ViewKey) => void;
  onAction: (message: string) => void;
}

const navItems: Array<{
  id: string;
  key: ViewKey;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { id: "overview", key: "overview", label: "Overview", icon: Home },
  { id: "incidents", key: "incident", label: "Incidents", icon: LifeBuoy },
  { id: "reports", key: "brief", label: "Reports", icon: FileText },
  { id: "tasks", key: "tasks", label: "Tasks", icon: ClipboardList },
  { id: "resources", key: "resources", label: "Resources", icon: ShieldCheck },
  { id: "volunteers", key: "volunteers", label: "Volunteers", icon: UsersRound },
  { id: "analytics", key: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", key: "settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  view,
  notice,
  dataMode,
  onDataModeChange,
  onViewChange,
  onAction,
}: AppShellProps): React.JSX.Element {
  const isLanding = view === "landing";

  return (
    <div className={isLanding ? "site-frame landing-frame" : "site-frame"}>
      {isLanding ? (
        <header className="topbar">
          <Logo />
          <nav className="topnav" aria-label="Primary navigation">
            <button type="button" onClick={() => onViewChange("landing")}>
              Product
            </button>
            <button type="button" onClick={() => onViewChange("brief")}>
              How It Works
            </button>
            <button type="button" onClick={() => onViewChange("volunteers")}>
              For Teams
            </button>
            <button type="button" onClick={() => onViewChange("resources")}>
              Resources
            </button>
          </nav>
          <div className="top-actions">
            <ModeToggle mode={dataMode} onModeChange={onDataModeChange} />
            <button type="button" className="ghost-button" onClick={() => onViewChange("settings")}>
              Sign in
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => onViewChange("overview")}
            >
              Open Command
            </button>
          </div>
        </header>
      ) : (
        <aside className="sidebar">
          <Logo />
          <nav className="side-nav" aria-label="Command navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.key === view;

              return (
                <button
                  type="button"
                  className={active ? "side-link active" : "side-link"}
                  key={item.id}
                  onClick={() => onViewChange(item.key)}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <button type="button" className="operator-card" onClick={() => onViewChange("landing")}>
            <span className="avatar">AK</span>
            <span>
              <strong>Amaan Khan</strong>
              <small>Coordinator</small>
            </span>
          </button>
        </aside>
      )}
      <main className={isLanding ? "landing-main" : "workspace"}>
        {!isLanding ? (
          <div className="workspace-topbar">
            <div className="command-notice" role="status">
              {notice}
            </div>
            <ModeToggle mode={dataMode} onModeChange={onDataModeChange} />
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}

interface ModeToggleProps {
  mode: DataMode;
  onModeChange: (mode: DataMode) => void;
}

function ModeToggle({ mode, onModeChange }: ModeToggleProps): React.JSX.Element {
  return (
    <div className="mode-toggle" aria-label="Data mode">
      <button
        type="button"
        className={mode === "live" ? "active" : ""}
        onClick={() => onModeChange("live")}
      >
        Live
      </button>
      <button
        type="button"
        className={mode === "demo" ? "active" : ""}
        onClick={() => onModeChange("demo")}
      >
        Demo
      </button>
    </div>
  );
}
