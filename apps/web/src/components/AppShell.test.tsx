import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell.js";

describe("AppShell", () => {
  const shellProps = {
    notice: "Ready",
    dataMode: "live" as const,
    onDataModeChange: vi.fn(),
    onAction: vi.fn(),
  };

  it("renders the dark command navigation", () => {
    render(
      <AppShell view="overview" onViewChange={vi.fn()} {...shellProps}>
        <div>Workspace content</div>
      </AppShell>,
    );

    expect(screen.getByRole("navigation", { name: "Command navigation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Incidents" })).toBeInTheDocument();
    expect(screen.getByText("DIZMO")).toBeInTheDocument();
  });

  it("renders landing navigation without command sidebar", () => {
    render(
      <AppShell view="landing" onViewChange={vi.fn()} {...shellProps}>
        <div>Landing content</div>
      </AppShell>,
    );

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Command navigation" }),
    ).not.toBeInTheDocument();
  });

  it("keeps only the matching sidebar destination active", () => {
    render(
      <AppShell view="brief" onViewChange={vi.fn()} {...shellProps}>
        <div>Workspace content</div>
      </AppShell>,
    );

    expect(screen.getByRole("button", { name: "Reports" })).toHaveClass("active");
    expect(screen.getByRole("button", { name: "Tasks" })).not.toHaveClass("active");
  });

  it("routes every sidebar section to its own view key", () => {
    const onViewChange = vi.fn();
    render(
      <AppShell view="overview" onViewChange={onViewChange} {...shellProps}>
        <div>Workspace content</div>
      </AppShell>,
    );

    for (const [label, view] of [
      ["Overview", "overview"],
      ["Incidents", "incident"],
      ["Reports", "brief"],
      ["Tasks", "tasks"],
      ["Resources", "resources"],
      ["Volunteers", "volunteers"],
      ["Analytics", "analytics"],
      ["Settings", "settings"],
    ] as const) {
      screen.getByRole("button", { name: label }).click();
      expect(onViewChange).toHaveBeenLastCalledWith(view);
    }
  });

  it("switches between live and demo data modes", () => {
    const onDataModeChange = vi.fn();
    render(
      <AppShell
        view="overview"
        notice="Ready"
        dataMode="live"
        onDataModeChange={onDataModeChange}
        onViewChange={vi.fn()}
        onAction={vi.fn()}
      >
        <div>Workspace content</div>
      </AppShell>,
    );

    screen.getByRole("button", { name: "Demo" }).click();

    expect(onDataModeChange).toHaveBeenCalledWith("demo");
  });
});
