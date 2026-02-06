# Animal Maths

## Deploying

Run `./scripts/deploy.sh` from the repo root. It reads `VERCEL_KEY` from `.env.local`, runs tests, builds, and deploys to Vercel production.

## Testing

```
npx vitest run
```

## Workflow Rules

After completing code changes, ALWAYS commit and push to the remote repository unless explicitly told not to. If a deployment step exists (e.g., Vercel, etc.), run it as well.

When writing SQL queries for this codebase, always include the schema prefix (e.g., `public."TableName"`), use double-quoted column names for camelCase columns, and verify column names exist before running queries.

Follow TDD workflow: write tests first, then implement, then verify tests pass. When building features from a plan, complete ALL steps in the plan including commit and deploy before declaring done.

Before pushing to GitHub, always check for: (1) sensitive files (.env with real keys, API tokens), (2) large files exceeding 100MB, (3) log files that should be gitignored. Proactively fix these before attempting to push.
