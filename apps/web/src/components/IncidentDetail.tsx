import type { Incident } from "@dizmo/core";
import {
  Clock3,
  Droplets,
  MapPin,
  MoreHorizontal,
  PackageCheck,
  Truck,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { dashboardData } from "../data/dashboard.js";
import { Badge } from "./DashboardHome.js";

interface IncidentDetailProps {
  incident: Incident;
  onBack: () => void;
  onAction: (message: string) => void;
}

const incidentTabs = ["Overview", "Updates (6)", "Tasks (2)", "Resources", "Activity"] as const;

export function IncidentDetail({
  incident,
  onBack,
  onAction,
}: IncidentDetailProps): React.JSX.Element {
  const depot = dashboardData.depots[0];
  const [activeTab, setActiveTab] = useState<(typeof incidentTabs)[number]>("Overview");

  return (
    <div className="page-stack">
      <header className="detail-header">
        <button type="button" className="back-link" onClick={onBack}>
          Back to incidents
        </button>
        <div className="detail-title-row">
          <div>
            <h1>Water shortage at Shelter North</h1>
            <p>Incident ID: INC-2025-0001 - Created 2 min ago - By Ravi (Field Responder)</p>
          </div>
          <Badge tone={incident.priority}>{`${incident.priority} priority`}</Badge>
          <button
            type="button"
            className="icon-button"
            aria-label="More actions"
            onClick={() => onAction("Incident action menu opened")}
          >
            <MoreHorizontal size={18} />
          </button>
          <button
            type="button"
            className="primary-button compact"
            onClick={() => onAction("Incident update staged")}
          >
            <PackageCheck size={15} />
            Update
          </button>
        </div>
        <nav className="tabs" aria-label="Incident sections">
          {incidentTabs.map((tab) => (
            <button
              type="button"
              className={activeTab === tab ? "active" : ""}
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                onAction(`${tab} opened for Shelter North`);
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="tab-summary" role="status">
          Active section: {activeTab}
        </div>
      </header>
      <section className="detail-grid">
        <article className="panel detail-card">
          <h2>Summary</h2>
          <p>
            Shelter North has only 12 water crates remaining. 80 people are currently inside and two
            buses are arriving with 40 more people.
          </p>
          <hr />
          <h3>Key Details</h3>
          <Definition label="Location" value="Shelter North" />
          <Definition label="People Affected" value="120+" />
          <Definition label="Category" value="Supply Shortage" />
          <Definition label="Reported At" value="Today, 10:24 AM" />
        </article>
        <div className="resource-column">
          <article className="panel detail-card">
            <h2>Resource Check</h2>
            <Resource
              icon={PackageCheck}
              title={depot?.name ?? "Central Depot"}
              text="40 water crates available"
              meta="2.3 km away"
            />
            <Resource icon={UsersRound} title="Drivers Available" text="3 volunteers within 4 km" />
            <Resource icon={Clock3} title="ETA" text="45-60 minutes" />
          </article>
          <article className="panel detail-card">
            <h2>Evidence</h2>
            <div className="evidence-item">
              <span className="incident-mark" />
              <div>
                <strong>#shelter-updates</strong>
                <p>Two buses arriving with 40 people. Water stock reported low.</p>
                <small>2 min ago</small>
              </div>
            </div>
            <button
              type="button"
              className="secondary-button full"
              onClick={() => onAction("Evidence bundle opened")}
            >
              View all evidence (4)
            </button>
          </article>
        </div>
        <article className="panel detail-card action-card">
          <h2>Recommended Action</h2>
          <h3>Dispatch 25 water crates from Central Depot to Shelter North.</h3>
          <h3>Rationale</h3>
          <p>
            Low water supply with incoming population increase. Nearest stock available at Central
            Depot.
          </p>
          <div className="confidence">
            <span>Confidence</span>
            <strong>High (0.87)</strong>
            <div>
              <span />
            </div>
          </div>
          <hr />
          <h3>Actions</h3>
          <div className="action-grid">
            <button
              type="button"
              className="primary-button compact"
              onClick={() => onAction("Water delivery task created")}
            >
              Create Task
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onAction("Driver assignment prepared")}
            >
              Assign Driver
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onAction("Escalation drafted for coordinator approval")}
            >
              Escalate
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

interface DefinitionProps {
  label: string;
  value: string;
}

function Definition({ label, value }: DefinitionProps): React.JSX.Element {
  return (
    <dl className="definition">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}

interface ResourceProps {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  text: string;
  meta?: string;
}

function Resource({ icon: Icon, title, text, meta }: ResourceProps): React.JSX.Element {
  return (
    <div className="resource-item">
      <span>
        <Icon size={17} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
        {meta ? <small>{meta}</small> : null}
      </div>
    </div>
  );
}
