import type { ExtractedReport, FieldReport, IncidentPriority } from "./schemas.js";

const priorityTerms: Record<IncidentPriority, string[]> = {
  critical: ["trapped", "missing", "unconscious", "water rising", "rescue", "medical emergency"],
  high: [
    "injury",
    "elderly",
    "child",
    "shortage",
    "almost full",
    "urgent",
    "stranded",
    "only",
    "left",
  ],
  medium: ["need", "request", "delayed", "blocked", "arriving"],
  low: ["update", "watch", "monitor"],
};

const knownLocations = [
  "Shelter North",
  "Central High Shelter",
  "Riverside Gym",
  "Ward 8 bridge checkpoint",
  "Ward 8",
  "Central Depot",
  "East Depot",
  "Central District",
  "Main Road",
];

const operationalTerms = [
  "arriving",
  "blocked",
  "bridge",
  "bus",
  "buses",
  "capacity",
  "crate",
  "crates",
  "depot",
  "driver",
  "elderly",
  "evacuee",
  "evacuees",
  "family",
  "flood",
  "injury",
  "medical",
  "people",
  "rescue",
  "resident",
  "residents",
  "road",
  "shelter",
  "shortage",
  "supply",
  "trapped",
  "transport",
  "water",
];

const greetingTerms = new Set(["hi", "hello", "hey", "yo", "test", "ping", "thanks", "thank you"]);

export function extractReport(report: FieldReport): ExtractedReport {
  const text = report.rawText.trim();
  const lower = text.toLowerCase();
  const priority = detectPriority(lower);
  const location = detectLocation(text);
  const peopleAffected = detectPeopleAffected(lower);
  const need = detectNeed(lower);
  const incidentType = detectIncidentType(lower);
  const keywords = collectKeywords(lower);

  return {
    incidentType,
    location,
    need,
    peopleAffected,
    priority,
    confidence: location === "Unknown location" ? 0.62 : 0.86,
    summary: summarize(text, location, need, priority),
    keywords,
  };
}

export function shouldIntakeFieldReport(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s+/g, " ").trim();

  if (!normalized || greetingTerms.has(normalized)) {
    return false;
  }

  if (knownLocations.some((location) => normalized.includes(location.toLowerCase()))) {
    return true;
  }

  const hasOperationalTerm = operationalTerms.some((term) => normalized.includes(term));
  const hasNumber = /\b\d+\b/.test(normalized);
  const hasActionSignal = /\b(need|needs|left|only|urgent|missing|stuck|full|low|critical)\b/.test(
    normalized,
  );

  return hasOperationalTerm && (hasNumber || hasActionSignal);
}

function detectPriority(lower: string): IncidentPriority {
  if (priorityTerms.critical.some((term) => lower.includes(term))) {
    return "critical";
  }

  if (priorityTerms.high.some((term) => lower.includes(term))) {
    return "high";
  }

  if (priorityTerms.medium.some((term) => lower.includes(term))) {
    return "medium";
  }

  return "low";
}

function detectLocation(text: string): string {
  const lower = text.toLowerCase();
  const match = knownLocations.find((location) => lower.includes(location.toLowerCase()));
  return match ?? "Unknown location";
}

function detectPeopleAffected(lower: string): number | undefined {
  const familyMatch = lower.match(/family of (\d+)/);
  if (familyMatch?.[1]) {
    return Number.parseInt(familyMatch[1], 10);
  }

  const peopleMatch = lower.match(/(\d+)\s+(people|persons|residents|evacuees)/);
  if (peopleMatch?.[1]) {
    return Number.parseInt(peopleMatch[1], 10);
  }

  return undefined;
}

function detectNeed(lower: string): string {
  if (lower.includes("rescue") || lower.includes("stranded") || lower.includes("trapped")) {
    return "rescue verification";
  }

  if (lower.includes("medical") || lower.includes("injury") || lower.includes("medic")) {
    return "medical support";
  }

  if (lower.includes("water")) {
    return "water";
  }

  if (lower.includes("driver") || lower.includes("transport")) {
    return "transport";
  }

  if (lower.includes("shelter") || lower.includes("full")) {
    return "shelter capacity";
  }

  return "coordination";
}

function detectIncidentType(lower: string): string {
  if (lower.includes("water")) {
    return "supply_shortage";
  }

  if (lower.includes("stranded") || lower.includes("trapped") || lower.includes("rescue")) {
    return "rescue_request";
  }

  if (lower.includes("shelter") || lower.includes("full")) {
    return "shelter_capacity";
  }

  return "field_update";
}

function collectKeywords(lower: string): string[] {
  const candidates = [
    "water",
    "shelter",
    "driver",
    "rescue",
    "medical",
    "ward 8",
    "north",
    "bridge",
    "elderly",
  ];

  return candidates.filter((candidate) => lower.includes(candidate));
}

function summarize(
  text: string,
  location: string,
  need: string,
  priority: IncidentPriority,
): string {
  const clean = text.length > 180 ? `${text.slice(0, 177)}...` : text;
  return `${priority.toUpperCase()} ${need} report at ${location}: ${clean}`;
}
