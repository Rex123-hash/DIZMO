import { describe, expect, it } from "vitest";
import { DemoReliefToolset } from "./tools.js";

describe("DemoReliefToolset", () => {
  const tools = new DemoReliefToolset();

  it("finds shelter capacity by name", async () => {
    const shelter = await tools.getShelterCapacity("Shelter North");

    expect(shelter?.capacity).toBe(100);
    expect(shelter?.status).toBe("stressed");
  });

  it("returns undefined for unknown shelter", async () => {
    const shelter = await tools.getShelterCapacity("Unknown Shelter");

    expect(shelter).toBeUndefined();
  });

  it("returns depots with water stock", async () => {
    const depots = await tools.getSupplyStatus("water");

    expect(depots.every((depot) => depot.waterCrates > 0)).toBe(true);
  });

  it("filters volunteers by skill and availability", async () => {
    const drivers = await tools.findAvailableVolunteers("driver");

    expect(drivers.map((driver) => driver.name)).toContain("Asha");
    expect(drivers.every((driver) => driver.availability === "available")).toBe(true);
  });
});
