import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App.js";

describe("App", () => {
  it("starts on the landing page and gates fixture data in live mode", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /Turn chaos into/i })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Open Command" })[0] as HTMLElement);

    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText("Live Operations Run In Slack")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Slack Channel" })).toHaveAttribute(
      "href",
      "https://app.slack.com/client/T0BGV92F0D7/C0BHMNU8PB2",
    );
    expect(screen.queryByText("Open Incidents")).not.toBeInTheDocument();
  });

  it("shows fixture command data only after switching to demo mode", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Demo" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Open Command" })[0] as HTMLElement);

    expect(screen.getByText("Open Incidents")).toBeInTheDocument();
  });
});
