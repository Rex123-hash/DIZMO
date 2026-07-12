import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

const currentDir = dirname(fileURLToPath(import.meta.url));
const envCandidates = [
  resolve(process.cwd(), ".env"),
  resolve(currentDir, "../../../.env"),
  resolve(currentDir, "../.env"),
];

for (const envPath of envCandidates) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
    break;
  }
}

const envSchema = z.object({
  SLACK_BOT_TOKEN: z.string().min(1),
  SLACK_SIGNING_SECRET: z.string().min(1),
  SLACK_APP_TOKEN: z.string().min(1),
  SLACK_RESPONSE_CHANNEL_ID: z.string().min(1),
  MCP_SERVER_URL: z.string().url().default("http://127.0.0.1:4317"),
  USE_LOCAL_SEARCH: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  LIVE_DATA_ONLY: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  ALLOW_DEMO_DATA: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  PORT: z.coerce.number().int().positive().default(3000),
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(): AppConfig {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  return parsed.data;
}
