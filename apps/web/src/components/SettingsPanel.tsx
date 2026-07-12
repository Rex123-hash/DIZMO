import { CheckCircle2, CloudSun, KeyRound, Search, Server, Slack } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "./DashboardHome.js";

const integrations = [
  { name: "Slack Workspace", detail: "Connected to DIZMO Response", icon: Slack },
  { name: "Relief MCP Server", detail: "https://mcp.dizmo.app", icon: Server },
  { name: "Real-Time Search API", detail: "Search remote Slack content", icon: Search },
  { name: "Weather API", detail: "OpenWeatherMap", icon: CloudSun },
] as const;

const settingsTabs = ["General", "Integrations", "Notifications", "Users", "Audit Logs"] as const;

interface SettingsPanelProps {
  onAction?: (message: string) => void;
}

export function SettingsPanel({
  onAction = () => undefined,
}: SettingsPanelProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<(typeof settingsTabs)[number]>("Integrations");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");

  function startEditing(label: string): void {
    setEditingKey(label);
    setDraftValue("");
    onAction(`${label} editor opened`);
  }

  function saveKey(): void {
    if (!editingKey) {
      return;
    }

    onAction(`${editingKey} saved locally for deployment`);
    setEditingKey(null);
    setDraftValue("");
  }

  return (
    <div className="page-stack">
      <PageHeader title="Settings" showTimeRange={false} />
      <nav className="tabs settings-tabs" aria-label="Settings sections">
        {settingsTabs.map((tab) => (
          <button
            type="button"
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              onAction(`${tab} settings opened`);
            }}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section className="panel settings-panel">
        <h2>{activeTab === "Integrations" ? "Connected Integrations" : `${activeTab} Settings`}</h2>
        {activeTab === "Integrations" ? (
          integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div className="integration-row" key={integration.name}>
                <span className="integration-icon">
                  <Icon size={19} />
                </span>
                <div>
                  <strong>{integration.name}</strong>
                  <small>{integration.detail}</small>
                </div>
                <span className="connected">
                  Connected
                  <CheckCircle2 size={14} />
                </span>
              </div>
            );
          })
        ) : (
          <div className="settings-empty">
            <strong>{activeTab}</strong>
            <p>Configuration controls are available for the active command workspace.</p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onAction(`${activeTab} configuration refreshed`)}
            >
              Refresh Settings
            </button>
          </div>
        )}
      </section>
      <section className="panel settings-panel">
        <h2>API Keys</h2>
        {editingKey ? (
          <div className="key-editor">
            <label>
              {editingKey}
              <input
                type="password"
                value={draftValue}
                placeholder="Paste key for local deployment"
                onChange={(event) => setDraftValue(event.target.value)}
              />
            </label>
            <div>
              <button type="button" className="primary-button compact" onClick={saveKey}>
                Save
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setEditingKey(null);
                  setDraftValue("");
                  onAction(`${editingKey} edit cancelled`);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
        <SecretRow label="OpenAI API Key" onEdit={startEditing} />
        <SecretRow label="Google Maps API Key" onEdit={startEditing} />
      </section>
    </div>
  );
}

interface SecretRowProps {
  label: string;
  onEdit: (label: string) => void;
}

function SecretRow({ label, onEdit }: SecretRowProps): React.JSX.Element {
  return (
    <div className="secret-row">
      <span>
        <KeyRound size={17} />
        {label}
      </span>
      <code>....................</code>
      <button type="button" className="secondary-button" onClick={() => onEdit(label)}>
        Edit
      </button>
    </div>
  );
}
