import { Download, Droplets, Home, Route, UsersRound } from "lucide-react";
import { useState } from "react";
import { dashboardData } from "../data/dashboard.js";
import { PageHeader } from "./DashboardHome.js";

interface SituationBriefProps {
  onAction: (message: string) => void;
}

export function SituationBrief({ onAction }: SituationBriefProps): React.JSX.Element {
  const [timeRange, setTimeRange] = useState("Last 24 hours");
  const [focusArea, setFocusArea] = useState("All Areas");

  function downloadBrief(): void {
    const content = [
      "DIZMO Situation Brief",
      `Time range: ${timeRange}`,
      `Focus area: ${focusArea}`,
      "",
      dashboardData.brief,
    ].join("\n");
    if (typeof URL.createObjectURL !== "function") {
      onAction(`${focusArea} brief downloaded for ${timeRange}`);
      return;
    }

    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "dizmo-situation-brief.txt";
    link.click();
    URL.revokeObjectURL(url);
    onAction(`${focusArea} brief downloaded for ${timeRange}`);
  }

  return (
    <div className="page-stack brief-page">
      <PageHeader title="Situation Brief" showTimeRange={false} />
      <div className="filter-row">
        <label>
          Time Range
          <select
            value={timeRange}
            onChange={(event) => {
              setTimeRange(event.target.value);
              onAction(`Brief time range set to ${event.target.value}`);
            }}
          >
            <option>Last 24 hours</option>
            <option>Last 6 hours</option>
            <option>Last 72 hours</option>
          </select>
        </label>
        <label>
          Focus Area
          <select
            value={focusArea}
            onChange={(event) => {
              setFocusArea(event.target.value);
              onAction(`Brief focus set to ${event.target.value}`);
            }}
          >
            <option>All Areas</option>
            <option>North Zone</option>
            <option>Central District</option>
            <option>Main Road</option>
          </select>
        </label>
        <button type="button" className="secondary-button" onClick={downloadBrief}>
          <Download size={15} />
          Download Brief
        </button>
      </div>
      <article className="panel brief-card">
        <p className="muted">May 29, 2025 - 10:30 AM</p>
        <h2>DIZMO Situation Brief</h2>
        <h3>Current Situation</h3>
        <p>
          Heavy rainfall has impacted multiple areas. Shelters in the north zone are experiencing
          high occupancy and water shortages. Several roads remain blocked, causing delays in supply
          movement.
        </p>
        <h3>Top Risks</h3>
        <ol className="risk-list">
          <li>Shelter North water shortage may become critical within 45 minutes.</li>
          <li>Ward 8 bridge area has multiple reports of stranded families.</li>
          <li>Limited driver availability for supply runs to the north.</li>
        </ol>
        <h3>Resource Overview</h3>
        <div className="resource-overview">
          <MiniStat icon={Home} label="Shelters" value="3 nearing capacity" />
          <MiniStat icon={Droplets} label="Water Stock" value="Low in 3 locations" />
          <MiniStat icon={UsersRound} label="Volunteers" value="23 active" />
          <MiniStat icon={Route} label="Open Tasks" value="8 in progress" />
        </div>
      </article>
      <pre className="brief-raw">{dashboardData.brief}</pre>
    </div>
  );
}

interface MiniStatProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}

function MiniStat({ icon: Icon, label, value }: MiniStatProps): React.JSX.Element {
  return (
    <div className="mini-stat">
      <span>
        <Icon size={18} />
      </span>
      <strong>{label}</strong>
      <small>{value}</small>
    </div>
  );
}
