import { ArrowUpRight, ChevronRight, Droplets, Flame, Plus, UsersRound } from "lucide-react";
import { dashboardData } from "../data/dashboard.js";

interface DashboardHomeProps {
  onOpenIncident: () => void;
  onOpenBrief: () => void;
  onCreateReport: () => void;
  onAction: (message: string) => void;
}

const metrics = [
  { label: "Open Incidents", value: "12", tone: "danger", change: "2 from yesterday" },
  { label: "High Priority", value: "5", tone: "warning", change: "1 from yesterday" },
  { label: "In Progress Tasks", value: "8", tone: "blue", change: "3 from yesterday" },
  { label: "Active Volunteers", value: "23", tone: "green", change: "4 from yesterday" },
] as const;

const incidentTitles = [
  "Water shortage at Shelter North",
  "Families stranded near Ward 8 Bridge",
  "Riverside Gym capacity nearing limit",
  "Medical assistance needed",
  "Road blocked due to flooding",
] as const;

export function DashboardHome({
  onOpenIncident,
  onOpenBrief,
  onCreateReport,
  onAction,
}: DashboardHomeProps): React.JSX.Element {
  return (
    <div className="page-stack">
      <PageHeader
        title="Overview"
        action="New Report"
        onAction={onCreateReport}
        onTimeRange={() => onAction("Overview time range set to last 24 hours")}
      />
      <section className="metric-grid">
        {metrics.map((metric) => (
          <article className={`metric-card ${metric.tone}`} key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
            <small>
              <ArrowUpRight size={13} />
              {metric.change}
            </small>
          </article>
        ))}
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>Recent Incidents</h2>
          <button type="button" className="text-button" onClick={onOpenIncident}>
            View all
          </button>
        </div>
        <div className="incident-table">
          <div className="table-row table-head">
            <span>Incident</span>
            <span>Location</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Last Update</span>
            <span />
          </div>
          {dashboardData.incidents.map((incident, index) => (
            <button type="button" className="table-row" key={incident.id} onClick={onOpenIncident}>
              <span className="incident-name">
                <span className="incident-mark" />
                {incidentTitles[index] ?? titleCase(incident.summary)}
              </span>
              <span>{incident.location}</span>
              <span>
                <Badge tone={incident.priority}>{incident.priority}</Badge>
              </span>
              <span>{incident.status}</span>
              <span>{index === 0 ? "2 min ago" : `${index * 12 + 10} min ago`}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>
      <section className="snapshot-grid">
        <article className="panel snapshot-panel">
          <h2>Situation Snapshot</h2>
          <p>
            <Flame size={15} /> 2 shelters nearing capacity
          </p>
          <p>
            <Droplets size={15} /> Water supplies low in 3 locations
          </p>
          <p>
            <UsersRound size={15} /> Heavy rainfall expected in 6-8 hours
          </p>
          <button type="button" className="text-button" onClick={onOpenBrief}>
            View full brief
          </button>
        </article>
        <article className="map-panel" aria-label="Live incident map">
          <iframe
            title="Live incident map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.185%2C28.596%2C77.235%2C28.626&layer=mapnik&marker=28.6139%2C77.209"
            sandbox=""
          />
          <div className="map-overlay">
            <strong>Shelter North</strong>
            <span>28.6139, 77.2090</span>
          </div>
        </article>
      </section>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
  onTimeRange?: () => void;
  showTimeRange?: boolean;
}

export function PageHeader({
  title,
  action,
  onAction,
  onTimeRange,
  showTimeRange = true,
}: PageHeaderProps): React.JSX.Element {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      <div>
        {showTimeRange ? (
          <button type="button" className="select-button" onClick={onTimeRange}>
            Last 24 hours
          </button>
        ) : null}
        {action ? (
          <button type="button" className="primary-button compact" onClick={onAction}>
            <Plus size={15} />
            {action}
          </button>
        ) : null}
      </div>
    </header>
  );
}

interface BadgeProps {
  tone: string;
  children: string;
}

export function Badge({ tone, children }: BadgeProps): React.JSX.Element {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function titleCase(summary: string): string {
  const core = summary.split(": ").at(-1) ?? summary;
  return core.replace(/\.$/, "");
}
