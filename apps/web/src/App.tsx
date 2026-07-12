import { useState } from "react";
import { AppShell } from "./components/AppShell.js";
import { DashboardHome } from "./components/DashboardHome.js";
import { IncidentDetail } from "./components/IncidentDetail.js";
import { LandingPanel } from "./components/LandingPanel.js";
import {
  AnalyticsView,
  ResourcesView,
  TasksView,
  VolunteersView,
} from "./components/OperationsViews.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SituationBrief } from "./components/SituationBrief.js";
import { dashboardData } from "./data/dashboard.js";

export type ViewKey =
  | "landing"
  | "overview"
  | "incident"
  | "brief"
  | "tasks"
  | "resources"
  | "volunteers"
  | "analytics"
  | "settings";
export type DataMode = "live" | "demo";

export function App(): React.JSX.Element {
  const [view, setView] = useState<ViewKey>("landing");
  const [dataMode, setDataMode] = useState<DataMode>("live");
  const [notice, setNotice] = useState("Live mode requires Slack sandbox connection");
  const selectedIncident = dashboardData.incidents[0];

  function handleAction(message: string): void {
    setNotice(message);
  }

  function handleModeChange(mode: DataMode): void {
    setDataMode(mode);
    setNotice(
      mode === "live"
        ? "Live mode enabled: waiting for Slack sandbox data"
        : "Demo mode enabled: fictional fixture data visible",
    );
  }

  const shouldGateLiveData = dataMode === "live" && view !== "landing" && view !== "settings";

  return (
    <AppShell
      view={view}
      notice={notice}
      dataMode={dataMode}
      onDataModeChange={handleModeChange}
      onViewChange={setView}
      onAction={handleAction}
    >
      {view === "landing" ? (
        <LandingPanel
          onOpenDashboard={() => setView("overview")}
          onOpenBrief={() => setView("brief")}
          onAction={handleAction}
        />
      ) : null}
      {shouldGateLiveData ? (
        <LiveModePanel view={view} onOpenSettings={() => setView("settings")} />
      ) : null}
      {dataMode === "demo" && view === "overview" ? (
        <DashboardHome
          onOpenIncident={() => setView("incident")}
          onOpenBrief={() => setView("brief")}
          onCreateReport={() => {
            setView("brief");
            handleAction("New situation report opened");
          }}
          onAction={handleAction}
        />
      ) : null}
      {dataMode === "demo" && view === "incident" && selectedIncident ? (
        <IncidentDetail
          incident={selectedIncident}
          onBack={() => setView("overview")}
          onAction={handleAction}
        />
      ) : null}
      {dataMode === "demo" && view === "brief" ? <SituationBrief onAction={handleAction} /> : null}
      {dataMode === "demo" && view === "tasks" ? <TasksView onAction={handleAction} /> : null}
      {dataMode === "demo" && view === "resources" ? (
        <ResourcesView onAction={handleAction} />
      ) : null}
      {dataMode === "demo" && view === "volunteers" ? (
        <VolunteersView onAction={handleAction} />
      ) : null}
      {dataMode === "demo" && view === "analytics" ? (
        <AnalyticsView onAction={handleAction} />
      ) : null}
      {view === "settings" ? <SettingsPanel onAction={handleAction} /> : null}
    </AppShell>
  );
}

interface LiveModePanelProps {
  view: ViewKey;
  onOpenSettings: () => void;
}

function LiveModePanel({ view, onOpenSettings }: LiveModePanelProps): React.JSX.Element {
  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>{titleForView(view)}</h1>
      </header>
      <article className="panel live-empty-state">
        <h2>Live Data Connection Required</h2>
        <p>
          Live mode never renders fixture incidents, fake resources, or seeded volunteer data.
          Connect the Slack sandbox and live providers to populate this command view.
        </p>
        <div className="live-checklist">
          <span>Slack bot token configured</span>
          <span>Slack app-level token configured</span>
          <span>Slack response channel connected</span>
          <span>Relief MCP service reachable</span>
        </div>
        <button type="button" className="primary-button compact" onClick={onOpenSettings}>
          Open Settings
        </button>
      </article>
    </section>
  );
}

function titleForView(view: ViewKey): string {
  const titles: Record<ViewKey, string> = {
    landing: "DIZMO",
    overview: "Overview",
    incident: "Incidents",
    brief: "Reports",
    tasks: "Tasks",
    resources: "Resources",
    volunteers: "Volunteers",
    analytics: "Analytics",
    settings: "Settings",
  };

  return titles[view];
}
