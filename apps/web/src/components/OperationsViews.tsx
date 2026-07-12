import { BarChart3, ClipboardCheck, Download, PackageCheck, Truck, UsersRound } from "lucide-react";
import { useState } from "react";
import { dashboardData } from "../data/dashboard.js";
import { Badge } from "./DashboardHome.js";

interface OperationsViewProps {
  onAction: (message: string) => void;
}

export function TasksView({ onAction }: OperationsViewProps): React.JSX.Element {
  const [selectedTaskId, setSelectedTaskId] = useState(dashboardData.tasks[0]?.id ?? "");

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Tasks</h1>
        <button
          type="button"
          className="primary-button compact"
          onClick={() => onAction("New response task opened")}
        >
          <ClipboardCheck size={15} />
          New Task
        </button>
      </header>
      <div className="ops-layout">
        <article className="panel ops-list">
          <h2>Active Response Tasks</h2>
          {dashboardData.tasks.map((task) => (
            <button
              type="button"
              className={selectedTaskId === task.id ? "ops-row selected" : "ops-row"}
              key={task.id}
              onClick={() => {
                setSelectedTaskId(task.id);
                onAction(`${task.title} selected`);
              }}
            >
              <span>
                <strong>{task.title}</strong>
                <small>{task.owner ? `Owner: ${task.owner}` : "Owner pending"}</small>
              </span>
              <Badge tone={task.priority}>{task.priority}</Badge>
            </button>
          ))}
        </article>
        <article className="panel ops-detail">
          <h2>Task Controls</h2>
          <p>Review the selected task, assign ownership, and mark field progress.</p>
          <div className="command-grid">
            <button type="button" onClick={() => onAction("Selected task assigned to Asha")}>
              Assign Owner
            </button>
            <button type="button" onClick={() => onAction("Selected task marked in progress")}>
              Start Task
            </button>
            <button type="button" onClick={() => onAction("Selected task update posted to Slack")}>
              Post Update
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

export function ResourcesView({ onAction }: OperationsViewProps): React.JSX.Element {
  const [reservedDepot, setReservedDepot] = useState<string | null>(null);

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Resources</h1>
        <button
          type="button"
          className="primary-button compact"
          onClick={() => onAction("Resource refresh requested")}
        >
          <PackageCheck size={15} />
          Refresh Stock
        </button>
      </header>
      <div className="resource-grid-large">
        {dashboardData.depots.map((depot) => (
          <article className="panel stock-card" key={depot.id}>
            <h2>{depot.name}</h2>
            <dl>
              <div>
                <dt>Water Crates</dt>
                <dd>{depot.waterCrates}</dd>
              </div>
              <div>
                <dt>Blankets</dt>
                <dd>{depot.blankets}</dd>
              </div>
              <div>
                <dt>Med Kits</dt>
                <dd>{depot.medKits}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="secondary-button full"
              onClick={() => {
                setReservedDepot(depot.name);
                onAction(`${depot.name} stock reserved for Shelter North`);
              }}
            >
              Reserve Supplies
            </button>
          </article>
        ))}
      </div>
      {reservedDepot ? (
        <div className="evidence-panel" role="status">
          <strong>Reservation Drafted</strong>
          <span>{reservedDepot} is staged for coordinator approval.</span>
        </div>
      ) : null}
    </section>
  );
}

export function VolunteersView({ onAction }: OperationsViewProps): React.JSX.Element {
  const [filter, setFilter] = useState("all");

  const volunteers = dashboardData.volunteers.filter((volunteer) => {
    return filter === "all" || volunteer.skills.includes(filter);
  });

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Volunteers</h1>
        <div>
          <button type="button" className="select-button" onClick={() => setFilter("all")}>
            All
          </button>
          <button type="button" className="select-button" onClick={() => setFilter("driver")}>
            Drivers
          </button>
          <button type="button" className="select-button" onClick={() => setFilter("medic")}>
            Medics
          </button>
        </div>
      </header>
      <section className="panel volunteer-table">
        <h2>Available Team</h2>
        {volunteers.map((volunteer) => (
          <div className="volunteer-row" key={volunteer.id}>
            <span className="integration-icon">
              <UsersRound size={18} />
            </span>
            <div>
              <strong>{volunteer.name}</strong>
              <small>
                {volunteer.skills.join(", ")} - {volunteer.zone}
              </small>
            </div>
            <Badge tone={volunteer.availability === "available" ? "low" : "medium"}>
              {volunteer.availability}
            </Badge>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onAction(`${volunteer.name} assignment drafted`)}
            >
              Assign
            </button>
          </div>
        ))}
      </section>
    </section>
  );
}

export function AnalyticsView({ onAction }: OperationsViewProps): React.JSX.Element {
  const [showExport, setShowExport] = useState(false);
  const openIncidents = dashboardData.incidents.filter((incident) => incident.status === "open");
  const stressedShelters = dashboardData.shelters.filter(
    (shelter) => shelter.status === "stressed",
  );

  function downloadAnalytics(): void {
    const content = [
      "DIZMO Analytics Export",
      `Open incidents: ${openIncidents.length}`,
      `Stressed shelters: ${stressedShelters.length}`,
      `Active volunteers: ${dashboardData.volunteers.length}`,
    ].join("\n");

    if (typeof URL.createObjectURL === "function") {
      const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "dizmo-analytics.txt";
      link.click();
      URL.revokeObjectURL(url);
    }

    setShowExport(true);
    onAction("Analytics export downloaded");
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <h1>Analytics</h1>
        <button type="button" className="primary-button compact" onClick={downloadAnalytics}>
          <Download size={15} />
          Export
        </button>
      </header>
      <section className="metric-grid">
        <article className="metric-card danger">
          <strong>{openIncidents.length}</strong>
          <span>Open Incidents</span>
          <small>Requires coordinator review</small>
        </article>
        <article className="metric-card warning">
          <strong>{stressedShelters.length}</strong>
          <span>Stressed Shelters</span>
          <small>Capacity or supply pressure</small>
        </article>
        <article className="metric-card blue">
          <strong>0.87</strong>
          <span>Recommendation Confidence</span>
          <small>Evidence-backed action quality</small>
        </article>
        <article className="metric-card green">
          <strong>{dashboardData.volunteers.length}</strong>
          <span>Volunteer Signals</span>
          <small>Available roster entries</small>
        </article>
      </section>
      <article className="panel ops-detail">
        <h2>Pressure Analysis</h2>
        <p>
          North zone pressure remains highest because Shelter North has low water stock while new
          arrivals are inbound. Ward 8 remains the fastest escalation path because access is
          blocked.
        </p>
        <div className="command-grid">
          <button type="button" onClick={() => onAction("North zone pressure analysis refreshed")}>
            Refresh Analysis
          </button>
          <button type="button" onClick={() => onAction("Risk model evidence opened")}>
            View Evidence
          </button>
        </div>
      </article>
      {showExport ? (
        <div className="evidence-panel" role="status">
          <strong>Analytics Export Ready</strong>
          <span>The current operational pressure summary has been downloaded.</span>
        </div>
      ) : null}
    </section>
  );
}
