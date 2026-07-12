import {
  DemoReliefToolset,
  type ReliefToolset,
  shelterSchema,
  supplyDepotSchema,
  volunteerSchema,
} from "@dizmo/core";
import { z } from "zod";

const shelterResponseSchema = z.object({
  result: shelterSchema.nullable(),
});

const supplyResponseSchema = z.object({
  result: z.array(supplyDepotSchema),
});

const volunteerResponseSchema = z.object({
  result: z.array(volunteerSchema),
});

export class HttpReliefToolset implements ReliefToolset {
  private readonly fallback = new DemoReliefToolset();

  constructor(
    private readonly baseUrl: string,
    private readonly allowFallback: boolean,
  ) {}

  async getShelterCapacity(location: string) {
    try {
      const response = await this.post("/tools/get_shelter_capacity", { location });
      return shelterResponseSchema.parse(response).result ?? undefined;
    } catch (error) {
      if (!this.allowFallback) {
        throw error;
      }
      return this.fallback.getShelterCapacity(location);
    }
  }

  async getSupplyStatus(item: string, location?: string) {
    try {
      const response = await this.post("/tools/get_supply_status", { item, location });
      return supplyResponseSchema.parse(response).result;
    } catch (error) {
      if (!this.allowFallback) {
        throw error;
      }
      return this.fallback.getSupplyStatus(item, location);
    }
  }

  async findAvailableVolunteers(skill: string, zone?: string) {
    try {
      const response = await this.post("/tools/find_available_volunteers", { skill, zone });
      return volunteerResponseSchema.parse(response).result;
    } catch (error) {
      if (!this.allowFallback) {
        throw error;
      }
      return this.fallback.findAvailableVolunteers(skill, zone);
    }
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    const response = await fetch(new URL(path, this.baseUrl), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`MCP tool request failed: ${response.status}`);
    }

    return response.json();
  }
}
