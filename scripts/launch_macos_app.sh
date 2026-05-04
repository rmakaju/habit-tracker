#!/bin/zsh
set -e

APP_DIR="/Users/rebikamakaju/repos/habit-tracker"
PORT="${HABIT_TRACKER_PORT:-3000}"
URL="http://127.0.0.1:${PORT}/?shortcutLaunch=$(/bin/date +%s)"
LOG_FILE="${APP_DIR}/start.log"
PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

NODE_BIN="$(command -v node || true)"
NPM_BIN="$(command -v npm || true)"

cd "$APP_DIR"

{
  echo ""
  echo "[$(/bin/date)] Launching Habit Tracker from desktop shortcut"
} >> "$LOG_FILE"

if [ -z "$NODE_BIN" ]; then
  echo "Node.js was not found. Install Node or update scripts/launch_macos_app.sh with the correct node path." >> "$LOG_FILE"
  /usr/bin/open -a TextEdit "$LOG_FILE"
  exit 1
fi

if [ ! -f "$APP_DIR/dist/index.html" ]; then
  if [ -z "$NPM_BIN" ]; then
    echo "npm was not found, and dist/index.html is missing. Cannot build the web app." >> "$LOG_FILE"
    /usr/bin/open -a TextEdit "$LOG_FILE"
    exit 1
  fi

  "$NPM_BIN" run build:web >> "$LOG_FILE" 2>&1
fi

"$NODE_BIN" "$APP_DIR/scripts/serve_static.js" >> "$LOG_FILE" 2>&1 &
SERVER_PID=$!

sleep 1

if /usr/bin/open -na "Google Chrome" --args --app="$URL"; then
  wait "$SERVER_PID"
else
  /usr/bin/open "$URL"
  wait "$SERVER_PID"
fi
