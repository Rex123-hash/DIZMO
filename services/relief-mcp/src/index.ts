import Fastify from "fastify";
import { z } from "zod";
import { reliefToolset, toolCatalog } from "./tools/catalog.js";

const port = Number.parseInt(process.env.PORT ?? "4317", 10);
const server = Fastify({
  logger: true,
});

const shelterQuerySchema = z.object({
  location: z.string().min(1),
});

const supplyQuerySchema = z.object({
  item: z.string().min(1),
  location: z.string().optional(),
});

const volunteerQuerySchema = z.object({
  skill: z.string().min(1),
  zone: z.string().optional(),
});

server.get("/health", async () => ({
  ok: true,
  service: "dizmo-relief-mcp",
}));

server.get("/tools", async () => ({
  tools: toolCatalog,
}));

server.post("/tools/get_shelter_capacity", async (request, reply) => {
  const parsed = shelterQuerySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.flatten() });
  }

  const shelter = await reliefToolset.getShelterCapacity(parsed.data.location);
  return { result: shelter ?? null };
});

server.post("/tools/get_supply_status", async (request, reply) => {
  const parsed = supplyQuerySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.flatten() });
  }

  const depots = await reliefToolset.getSupplyStatus(parsed.data.item, parsed.data.location);
  return { result: depots };
});

server.post("/tools/find_available_volunteers", async (request, reply) => {
  const parsed = volunteerQuerySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.flatten() });
  }

  const volunteers = await reliefToolset.findAvailableVolunteers(
    parsed.data.skill,
    parsed.data.zone,
  );
  return { result: volunteers };
});

await server.listen({ port, host: "0.0.0.0" });
