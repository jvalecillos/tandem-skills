#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const repo = dirname(dirname(fileURLToPath(import.meta.url)));

// Essential packages to check
const packagesToCheck = ["gemini-tandem", "claude-tandem", "opencode-tandem", "pi-tandem"];
const essentialFiles = ["prompt.md", "README.md", "LICENSE"];

console.error("Checking packages structure...");
for (const pkg of packagesToCheck) {
  const pkgDir = join(repo, "packages", pkg);
  if (!existsSync(pkgDir)) {
    console.error(`❌ Error: Package directory does not exist: ${pkgDir}`);
    process.exit(1);
  }

  for (const file of essentialFiles) {
    const filePath = join(pkgDir, file);
    if (!existsSync(filePath)) {
      console.error(`❌ Error: Essential file missing: ${filePath}`);
      process.exit(1);
    }
  }

  const skillsDir = join(pkgDir, "skills");
  if (!existsSync(skillsDir)) {
    console.error(`❌ Error: Skills directory missing in package: ${pkg}`);
    process.exit(1);
  }
}
console.error("✅ All packages and essential files are present.");

// Recursively find md files in packages (excluding runtime)
function getMdFiles(dir) {
  let results = [];
  const list = readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const res = join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== "runtime" && file.name !== "node_modules") {
        results = results.concat(getMdFiles(res));
      }
    } else if (file.isFile() && file.name.endsWith(".md")) {
      results.push(res);
    }
  }
  return results;
}

console.error("Scanning rendered markdown files for leaked placeholders or CLI markers...");
const allMdFiles = getMdFiles(join(repo, "packages"));
let hasError = false;

for (const filePath of allMdFiles) {
  const content = readFileSync(filePath, "utf8");
  const fileName = filePath.split("/").pop();

  // Check for leaked placeholders: {{placeholder}}
  const placeholderMatch = content.match(/{{[a-zA-Z0-9_]+}}/g);
  if (placeholderMatch) {
    console.error(`❌ Error: Leaked placeholder(s) ${JSON.stringify(placeholderMatch)} found in: ${filePath}`);
    hasError = true;
  }

  // Check for leaked CLI block markers: <!--cli:tool-->
  // Allowed ONLY in packages/*/prompt.md (used for runtime filtering)
  if (fileName !== "prompt.md") {
    if (content.includes("<!--cli:") || content.includes("<!--/cli-->")) {
      console.error(`❌ Error: Leaked CLI block marker found in non-prompt file: ${filePath}`);
      hasError = true;
    }
  } else {
    // For prompt.md, ensure it DOES contain CLI markers (verifies they weren't stripped during compile time)
    if (!content.includes("<!--cli:") || !content.includes("<!--/cli-->")) {
      console.error(`❌ Error: CLI block markers missing from prompt file: ${filePath}`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error("❌ Static validation failed.");
  process.exit(1);
}
console.error("✅ No leaked placeholders or static formatting issues found.");

// Optional: real Gemini extension validator, when the Gemini CLI is on PATH.
// Not a hard dependency - won't exist on every machine or in CI.
console.error("Checking for a local Gemini CLI...");
const hasGemini = spawnSync("gemini", ["--version"], { encoding: "utf8" }).status === 0;
if (hasGemini) {
  console.error("Checking: gemini extensions validate packages/gemini-tandem");
  const geminiVal = spawnSync("gemini", ["extensions", "validate", "packages/gemini-tandem"], { encoding: "utf8" });
  if (geminiVal.status !== 0) {
    console.error("❌ Gemini extension validation failed:");
    console.error(geminiVal.stdout || geminiVal.stderr);
    process.exit(1);
  }
  console.error("✅ Gemini extension validation passed.");
} else {
  console.error("ℹ️  Gemini CLI not found, skipping (not required).");
}

console.error("🎉 All verification checks passed successfully!");
process.exit(0);
