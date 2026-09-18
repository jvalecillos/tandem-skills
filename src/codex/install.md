To use this with Codex, clone this repo, copy the skills folder to your project's `.agents/` folder, and append the system prompt to your repository's existing `AGENTS.md` (or `PROMPT.md`):

```bash
# Clone this repo as a sibling of your project
git clone https://github.com/skhoroshavin/tandem-skills ../tandem-skills

# Copy skills locally
mkdir -p .agents/skills
cp -r ../tandem-skills/packages/codex-tandem/skills/* .agents/skills/

# Append system prompt to AGENTS.md
cat ../tandem-skills/packages/codex-tandem/prompt.md >> AGENTS.md
```