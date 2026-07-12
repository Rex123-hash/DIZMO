import { demoDepots, demoShelters, demoVolunteers } from "./fixtures.js";
import type { Shelter, SupplyDepot, Volunteer } from "./schemas.js";

export interface ReliefToolset {
  getShelterCapacity(location: string): Promise<Shelter | undefined>;
  getSupplyStatus(item: string, location?: string): Promise<SupplyDepot[]>;
  findAvailableVolunteers(skill: string, zone?: string): Promise<Volunteer[]>;
}

export class DemoReliefToolset implements ReliefToolset {
  async getShelterCapacity(location: string): Promise<Shelter | undefined> {
    const normalized = location.toLowerCase();
    return demoShelters.find((shelter) => shelter.name.toLowerCase().includes(normalized));
  }

  async getSupplyStatus(item: string, location?: string): Promise<SupplyDepot[]> {
    const normalizedItem = item.toLowerCase();
    const zone = location?.toLowerCase();

    return demoDepots
      .filter((depot) => {
        if (!zone) {
          return true;
        }

        return depot.zone === zone || depot.name.toLowerCase().includes(zone);
      })
      .filter((depot) => {
        if (normalizedItem.includes("water")) {
          return depot.waterCrates > 0;
        }

        if (normalizedItem.includes("blanket")) {
          return depot.blankets > 0;
        }

        if (normalizedItem.includes("med")) {
          return depot.medKits > 0;
        }

        return true;
      });
  }

  async findAvailableVolunteers(skill: string, zone?: string): Promise<Volunteer[]> {
    const normalizedSkill = skill.toLowerCase();
    const normalizedZone = zone?.toLowerCase();

    return demoVolunteers.filter((volunteer) => {
      const hasSkill = volunteer.skills.some((item) => item.toLowerCase() === normalizedSkill);
      const zoneMatches = !normalizedZone || volunteer.zone === normalizedZone;
      return volunteer.availability === "available" && hasSkill && zoneMatches;
    });
  }
}
