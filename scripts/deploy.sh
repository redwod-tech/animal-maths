#!/usr/bin/env bash
set -euo pipefail

# Load VERCEL_KEY from .env.local
if [ -f .env.local ]; then
  export $(grep '^VERCEL_KEY=' .env.local | xargs)
fi

if [ -z "${VERCEL_KEY:-}" ]; then
  echo "Error: VERCEL_KEY not set. Add it to .env.local or export it."
  exit 1
fi

echo "Running tests..."
npx vitest run
echo ""

echo "Building..."
npx next build
echo ""

echo "Deploying to Vercel (production)..."
npx vercel --prod --token="$VERCEL_KEY" --yes
echo ""

echo "Deploy complete!"
