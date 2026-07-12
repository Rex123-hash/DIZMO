import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const emojiPattern = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const sourceRoot = join(process.cwd(), "src");

describe("website content policy", () => {
  it("does not include emoji characters in web source files", () => {
    const offenders = collectFiles(sourceRoot)
      .filter((file) => /\.(tsx?|css|html|svg)$/.test(file))
      .filter((file) => emojiPattern.test(readFileSync(file, "utf8")));

    expect(offenders).toEqual([]);
  });
});

function collectFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return collectFiles(path);
    }

    return path;
  });
}
