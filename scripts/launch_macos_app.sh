#!/bin/zsh
set -e

APP_DIR="/Users/rebikamakaju/repos/habit-tracker"
PORT="${HABIT_TRACKER_PORT:-3000}"
URL="http://127.0.0.1:${PORT}/"
LOG_FILE="${APP_DIR}/start.log"

cd "$APP_DIR"

if [ ! -f "$APP_DIR/dist/index.html" ]; then
  npm run build:web >> "$LOG_FILE" 2>&1
fi

/usr/bin/env node "$APP_DIR/scripts/serve_static.js" >> "$LOG_FILE" 2>&1 &
SERVER_PID=$!

sleep 1

if /usr/bin/open -na "Google Chrome" --args --app="$URL"; then
  wait "$SERVER_PID"
else
  /usr/bin/open "$URL"
  wait "$SERVER_PID"
fi
