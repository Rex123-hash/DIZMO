import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SettingsPanel } from "./SettingsPanel.js";

describe("SettingsPanel", () => {
  it("renders connected integrations and key controls", () => {
    render(<SettingsPanel />);

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Relief MCP Server")).toBeInTheDocument();
    expect(screen.getByText("Real-Time Search API")).toBeInTheDocument();
    expect(screen.getByText("OpenAI API Key")).toBeInTheDocument();
  });

  it("opens an editable key form", () => {
    const onAction = vi.fn();
    render(<SettingsPanel onAction={onAction} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0] as HTMLElement);

    expect(screen.getByPlaceholderText("Paste key for local deployment")).toBeInTheDocument();
    expect(onAction).toHaveBeenCalledWith("OpenAI API Key editor opened");
  });
});
