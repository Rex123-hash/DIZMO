import { describe, expect, it } from "vitest";
import { LocalSearchAdapter } from "./search.js";

describe("LocalSearchAdapter", () => {
  it("returns related context for a shelter water query", async () => {
    const results = await new LocalSearchAdapter().search("Shelter North water");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.text).toContain("Shelter North");
  });

  it("limits result count", async () => {
    const results = await new LocalSearchAdapter().search("water shelter depot", 2);

    expect(results).toHaveLength(2);
  });

  it("returns an empty array for unrelated queries", async () => {
    const results = await new LocalSearchAdapter().search("quantum payroll invoice");

    expect(results).toHaveLength(0);
  });
});
