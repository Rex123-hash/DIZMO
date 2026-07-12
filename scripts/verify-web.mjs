import { chromium } from "playwright";

const targetUrl = process.env.DIZMO_WEB_URL ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];

page.on("console", (message) => {
  if (message.type() === "error") {
    errors.push(message.text());
  }
});
page.on("pageerror", (error) => errors.push(error.message));

await page.goto(targetUrl, { waitUntil: "networkidle" });

const checks = {
  hasContent: (await page.locator("body").innerText()).trim().length > 0,
  hasOverview: (await page.getByRole("heading", { name: "Overview" }).count()) > 0,
  hasCommandNavigation:
    (await page.getByRole("navigation", { name: "Command navigation" }).count()) > 0,
  hasIncidentTable: (await page.getByText("Recent Incidents").count()) > 0,
  hasDizmoBrand: (await page.getByText("DIZMO").first().count()) > 0,
  hasErrorOverlay: (await page.locator(".vite-error-overlay").count()) > 0,
};

await page.screenshot({ path: "artifacts/dizmo-web-overview.png", fullPage: true });
await page.getByRole("button", { name: /Water shortage at Shelter North/i }).click();
await page.screenshot({ path: "artifacts/dizmo-web-incident.png", fullPage: true });
await page.getByRole("button", { name: "Reports" }).click();
await page.screenshot({ path: "artifacts/dizmo-web-brief.png", fullPage: true });
await page.getByRole("button", { name: "Settings" }).click();
await page.screenshot({ path: "artifacts/dizmo-web-settings.png", fullPage: true });
await browser.close();

const failed = Object.entries(checks).filter(([key, value]) =>
  key === "hasErrorOverlay" ? value : !value,
);

if (errors.length > 0 || failed.length > 0) {
  console.error(JSON.stringify({ targetUrl, checks, errors }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      targetUrl,
      checks,
      errors,
      screenshots: [
        "artifacts/dizmo-web-overview.png",
        "artifacts/dizmo-web-incident.png",
        "artifacts/dizmo-web-brief.png",
        "artifacts/dizmo-web-settings.png",
      ],
    },
    null,
    2,
  ),
);
