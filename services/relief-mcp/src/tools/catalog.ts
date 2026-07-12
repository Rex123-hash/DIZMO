import { DemoReliefToolset } from "@dizmo/core";

export const reliefToolset = new DemoReliefToolset();

export const toolCatalog = [
  {
    name: "get_shelter_capacity",
    description: "Return shelter capacity, occupancy, water stock, and status for a named shelter.",
  },
  {
    name: "get_supply_status",
    description:
      "Return available supply depots for a requested item such as water, blankets, or med kits.",
  },
  {
    name: "find_available_volunteers",
    description: "Return available volunteers matching a skill and optional zone.",
  },
] as const;
