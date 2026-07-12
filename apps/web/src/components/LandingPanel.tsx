import { CheckCircle2, FileCheck2, MessagesSquare, ShieldCheck } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import { dashboardData } from "../data/dashboard.js";

interface LandingPanelProps {
  onOpenDashboard: () => void;
  onOpenBrief: () => void;
  onAction: (message: string) => void;
}

export function LandingPanel({
  onOpenDashboard,
  onOpenBrief,
  onAction,
}: LandingPanelProps): React.JSX.Element {
  const primaryIncident = dashboardData.incidents[0];
  const [previewStatus, setPreviewStatus] = useState("Preview ready");

  function handleDemoClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    onOpenDashboard();
  }

  function handlePreviewAction(message: string): void {
    setPreviewStatus(message);
    onAction(message);
  }

  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">
          <ShieldCheck size={14} />
          Built for disaster response teams
        </span>
        <h1>
          Turn chaos into <span>coordinated action.</span>
        </h1>
        <p>
          DIZMO monitors Slack channels, structures field reports, checks resource systems, and
          recommends the next human-approved response step.
        </p>
        <div className="hero-actions">
          <button type="button" className="primary-button big" onClick={handleDemoClick}>
            Open Command
          </button>
          <button type="button" className="secondary-button" onClick={onOpenBrief}>
            See Workflow
          </button>
        </div>
        <div className="feature-row">
          <Feature
            icon={MessagesSquare}
            title="Slack Native"
            text="Works where field teams already coordinate"
          />
          <Feature icon={CheckCircle2} title="Human Approved" text="Coordinators stay in control" />
          <Feature
            icon={FileCheck2}
            title="Evidence Visible"
            text="Every recommendation shows sources"
          />
        </div>
      </div>
      <div className="hero-visual" aria-label="DIZMO response preview">
        <div className="slack-rail">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="preview-card">
          <div className="preview-header"># response-ops</div>
          <div className="ops-card">
            <strong>
              {primaryIncident?.summary ?? "High Priority: Water shortage at Shelter North"}
            </strong>
            <small>80 people inside - 12 water crates left - 2 buses incoming</small>
            <dl>
              <div>
                <dt>Resource Check</dt>
                <dd>Central Depot: 40 crates available</dd>
              </div>
              <div>
                <dt>Drivers Available</dt>
                <dd>3 volunteers nearby</dd>
              </div>
              <div>
                <dt>ETA</dt>
                <dd>45-60 min</dd>
              </div>
            </dl>
            <p>Dispatch 25 water crates from Central Depot.</p>
            <div className="inline-actions">
              <button
                type="button"
                onClick={() => handlePreviewAction("Water delivery task drafted")}
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => handlePreviewAction("Nearest driver assignment prepared")}
              >
                Assign Driver
              </button>
            </div>
            <small className="preview-status" role="status">
              {previewStatus}
            </small>
          </div>
        </div>
      </div>
      <div className="trust-strip">
        <span>Trusted by response operators</span>
        <strong>FieldBridge</strong>
        <strong>CareGrid</strong>
        <strong>ReliefNet</strong>
        <strong>WorldAid Ops</strong>
      </div>
    </section>
  );
}

interface FeatureProps {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  text: string;
}

function Feature({ icon: Icon, title, text }: FeatureProps): React.JSX.Element {
  return (
    <article className="feature">
      <span>
        <Icon size={15} />
      </span>
      <strong>{title}</strong>
      <small>{text}</small>
    </article>
  );
}
