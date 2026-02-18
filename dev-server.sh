#!/bin/bash
# @module: DevServer
# @purpose: Serve AOCS site locally at aocs.lan/aocs
# @depends: python3

PORT=8080
BASE_PATH="/aocs"

echo "Starting AOCS dev server..."
echo "Local: http://localhost:$PORT$BASE_PATH"
echo "LAN: http://aocs.lan:$PORT$BASE_PATH"
echo ""
echo "Press Ctrl+C to stop"

cd "$(dirname "$0")/site"
python3 -m http.server $PORT
