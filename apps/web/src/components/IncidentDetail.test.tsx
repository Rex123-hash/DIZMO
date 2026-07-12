import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { dashboardData } from "../data/dashboard.js";
import { IncidentDetail } from "./IncidentDetail.js";

describe("IncidentDetail", () => {
  it("renders resource checks and human action controls", () => {
    const incident = dashboardData.incidents[0];

    if (!incident) {
      throw new Error("Expected demo incident");
    }

    const onAction = vi.fn();
    render(<IncidentDetail incident={incident} onBack={vi.fn()} onAction={onAction} />);

    expect(
      screen.getByRole("heading", { name: "Water shortage at Shelter North" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Resource Check")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Task" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assign Driver" })).toBeInTheDocument();

    screen.getByRole("button", { name: "Create Task" }).click();

    expect(onAction).toHaveBeenCalledWith("Water delivery task created");
  });
});
