#!/bin/sh
set -e
node src/render.mjs
(cd packages/pi-tandem && npm ci --silent && npx tsc --noEmit)
