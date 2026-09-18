To use this with Codex, copy the skills folder to your project's `.agents/` folder and append the system prompt to your repository's existing `AGENTS.md` (or `PROMPT.md`):

```bash
# Copy skills locally
mkdir -p .agents/skills
cp -r packages/codex-tandem/skills/* .agents/skills/

# Append system prompt to AGENTS.md
cat packages/codex-tandem/prompt.md >> AGENTS.md
```