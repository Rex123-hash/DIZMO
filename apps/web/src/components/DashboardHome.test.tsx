import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardHome } from "./DashboardHome.js";

describe("DashboardHome", () => {
  const props = {
    onOpenIncident: vi.fn(),
    onOpenBrief: vi.fn(),
    onCreateReport: vi.fn(),
    onAction: vi.fn(),
  };

  it("renders the command overview metrics", () => {
    render(<DashboardHome {...props} />);

    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText("Open Incidents")).toBeInTheDocument();
    expect(screen.getByText("Active Volunteers")).toBeInTheDocument();
    expect(screen.getByTitle("Live incident map")).toHaveAttribute(
      "src",
      expect.stringContaining("openstreetmap.org"),
    );
  });

  it("renders clean incident titles without raw extracted summaries", () => {
    render(<DashboardHome {...props} />);

    expect(screen.getByText("Water shortage at Shelter North")).toBeInTheDocument();
    expect(screen.getByText("Families stranded near Ward 8 Bridge")).toBeInTheDocument();
  });

  it("exposes the incident table as clickable rows", () => {
    const openIncident = vi.fn();
    render(
      <DashboardHome
        onOpenIncident={openIncident}
        onOpenBrief={vi.fn()}
        onCreateReport={vi.fn()}
        onAction={vi.fn()}
      />,
    );

    screen.getByRole("button", { name: /Water shortage at Shelter North/i }).click();

    expect(openIncident).toHaveBeenCalledTimes(1);
  });

  it("invokes report and brief controls", () => {
    const openBrief = vi.fn();
    const createReport = vi.fn();
    render(
      <DashboardHome
        onOpenIncident={vi.fn()}
        onOpenBrief={openBrief}
        onCreateReport={createReport}
        onAction={vi.fn()}
      />,
    );

    screen.getByRole("button", { name: "New Report" }).click();
    screen.getByRole("button", { name: "View full brief" }).click();

    expect(createReport).toHaveBeenCalledTimes(1);
    expect(openBrief).toHaveBeenCalledTimes(1);
  });
});
