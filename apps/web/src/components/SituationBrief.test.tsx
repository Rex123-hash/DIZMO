import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SituationBrief } from "./SituationBrief.js";

describe("SituationBrief", () => {
  it("renders the operational brief sections", () => {
    render(<SituationBrief onAction={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Situation Brief" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "DIZMO Situation Brief" })).toBeInTheDocument();
    expect(screen.getByText("Top Risks")).toBeInTheDocument();
    expect(screen.getByText("Resource Overview")).toBeInTheDocument();
  });

  it("downloads the brief export", () => {
    const onAction = vi.fn();
    render(<SituationBrief onAction={onAction} />);

    screen.getByRole("button", { name: "Download Brief" }).click();

    expect(onAction).toHaveBeenCalledWith("All Areas brief downloaded for Last 24 hours");
  });
});
