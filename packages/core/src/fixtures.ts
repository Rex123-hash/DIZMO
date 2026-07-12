import type { SearchResult, Shelter, SupplyDepot, Volunteer } from "./schemas.js";

export const demoShelters: Shelter[] = [
  {
    id: "shelter-north",
    name: "Shelter North",
    zone: "north",
    capacity: 100,
    currentOccupancy: 80,
    waterCrates: 12,
    status: "stressed",
  },
  {
    id: "central-high",
    name: "Central High Shelter",
    zone: "central",
    capacity: 160,
    currentOccupancy: 91,
    waterCrates: 44,
    status: "watch",
  },
  {
    id: "riverside-gym",
    name: "Riverside Gym",
    zone: "east",
    capacity: 70,
    currentOccupancy: 66,
    waterCrates: 18,
    status: "stressed",
  },
];

export const demoDepots: SupplyDepot[] = [
  {
    id: "central-depot",
    name: "Central Depot",
    zone: "central",
    waterCrates: 40,
    blankets: 120,
    medKits: 30,
  },
  {
    id: "east-depot",
    name: "East Depot",
    zone: "east",
    waterCrates: 18,
    blankets: 55,
    medKits: 12,
  },
];

export const demoVolunteers: Volunteer[] = [
  { id: "asha", name: "Asha", skills: ["driver"], zone: "north", availability: "available" },
  { id: "ravi", name: "Ravi", skills: ["medic"], zone: "east", availability: "available" },
  { id: "meera", name: "Meera", skills: ["coordinator"], zone: "central", availability: "busy" },
  { id: "omar", name: "Omar", skills: ["driver"], zone: "central", availability: "available" },
];

export const demoSlackMessages: SearchResult[] = [
  {
    id: "msg-1",
    channel: "#shelter-ops",
    author: "shelter-lead",
    text: "Two buses are headed to Shelter North with more evacuees.",
    createdAt: "2026-07-12T13:30:00.000Z",
    relevance: 0.85,
  },
  {
    id: "msg-2",
    channel: "#flood-response",
    author: "field-team-2",
    text: "Ward 8 bridge checkpoint has rising water and poor visibility.",
    createdAt: "2026-07-12T13:34:00.000Z",
    relevance: 0.86,
  },
  {
    id: "msg-3",
    channel: "#supply-desk",
    author: "supply-lead",
    text: "Central Depot has water crates but needs driver assignment for north route.",
    createdAt: "2026-07-12T13:38:00.000Z",
    relevance: 0.78,
  },
  {
    id: "msg-4",
    channel: "#shelter-ops",
    author: "riverside-manager",
    text: "Riverside Gym can take four more families only.",
    createdAt: "2026-07-12T13:41:00.000Z",
    relevance: 0.7,
  },
];
