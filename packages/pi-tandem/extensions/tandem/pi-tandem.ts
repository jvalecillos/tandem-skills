import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { filterCliTools } from "../../runtime/cli-tools.mjs";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const prompt = filterCliTools(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../../prompt.md"), "utf8"),
);

export default function (pi: ExtensionAPI) {
  pi.on("before_agent_start", (event) => {
    event.systemPromptOptions.sections.tandem = prompt;
  });
}
