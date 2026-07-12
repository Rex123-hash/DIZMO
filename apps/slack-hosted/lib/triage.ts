export interface TriageResult {
  summary: string;
  location: string;
  priority: "critical" | "high" | "medium" | "low";
  recommendation: string;
}

const criticalTerms = ["trapped", "stranded", "injured", "critical", "collapse", "medical"];
const highTerms = ["urgent", "shortage", "blocked", "flood", "evacuee", "water"];

export function triageReport(text: string): TriageResult {
  const normalized = text.toLowerCase();
  const priority = criticalTerms.some((term) => normalized.includes(term))
    ? "critical"
    : highTerms.some((term) => normalized.includes(term))
      ? "high"
      : normalized.includes("need") || normalized.includes("delay")
        ? "medium"
        : "low";

  return {
    summary: summarize(text),
    location: extractLocation(text),
    priority,
    recommendation: recommendationFor(priority, text),
  };
}

export function shouldBuildBrief(text: string): boolean {
  const normalized = text.toLowerCase();
  return ["brief", "summarize", "summary", "status", "current situation"].some((term) =>
    normalized.includes(term),
  );
}

function summarize(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > 120 ? `${cleaned.slice(0, 117)}...` : cleaned;
}

function extractLocation(text: string): string {
  const knownLocations = [
    "Shelter North",
    "Ward 8",
    "Central Depot",
    "Riverside Gym",
    "Main Road",
    "Central District",
    "response-ops",
  ];
  const match = knownLocations.find((location) =>
    text.toLowerCase().includes(location.toLowerCase()),
  );
  return match ?? "Unspecified field location";
}

function recommendationFor(priority: TriageResult["priority"], text: string): string {
  const normalized = text.toLowerCase();
  if (normalized.includes("water") || normalized.includes("shortage")) {
    return "Verify remaining water stock, assign nearest supply runner, and post ETA back to the channel.";
  }
  if (normalized.includes("stranded") || normalized.includes("trapped")) {
    return "Confirm exact location, assign rescue lead, and keep updates threaded until the family is reached.";
  }
  if (normalized.includes("medical") || normalized.includes("injured")) {
    return "Escalate to medical coordinator and request transport availability before dispatch.";
  }
  if (priority === "critical") {
    return "Escalate immediately, assign an owner, and request a confirmation update within 10 minutes.";
  }
  return "Create a response task, assign an owner, and ask the reporter for the next field update.";
}
