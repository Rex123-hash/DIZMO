import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnalyticsView, ResourcesView, TasksView, VolunteersView } from "./OperationsViews.js";

describe("OperationsViews", () => {
  it("renders and operates task controls", () => {
    const onAction = vi.fn();
    render(<TasksView onAction={onAction} />);

    fireEvent.click(screen.getByRole("button", { name: /Dispatch 25 water crates/i }));
    fireEvent.click(screen.getByRole("button", { name: "Assign Owner" }));

    expect(onAction).toHaveBeenCalledWith("Dispatch 25 water crates from Central Depot selected");
    expect(onAction).toHaveBeenCalledWith("Selected task assigned to Asha");
  });

  it("renders and operates resource controls", () => {
    const onAction = vi.fn();
    render(<ResourcesView onAction={onAction} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Reserve Supplies" })[0] as HTMLElement);

    expect(screen.getByText("Reservation Drafted")).toBeInTheDocument();
    expect(onAction).toHaveBeenCalledWith("Central Depot stock reserved for Shelter North");
  });

  it("renders and operates volunteer controls", () => {
    const onAction = vi.fn();
    render(<VolunteersView onAction={onAction} />);

    fireEvent.click(screen.getByRole("button", { name: "Drivers" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Assign" })[0] as HTMLElement);

    expect(screen.getByText("Asha")).toBeInTheDocument();
    expect(onAction).toHaveBeenCalledWith("Asha assignment drafted");
  });

  it("renders and operates analytics controls", () => {
    const onAction = vi.fn();
    render(<AnalyticsView onAction={onAction} />);

    fireEvent.click(screen.getByRole("button", { name: "Refresh Analysis" }));

    expect(screen.getByText("Pressure Analysis")).toBeInTheDocument();
    expect(onAction).toHaveBeenCalledWith("North zone pressure analysis refreshed");
  });
});
