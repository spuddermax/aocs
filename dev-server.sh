#!/bin/bash
# @module: DevServer
# @purpose: Serve AOCS site locally at aocs.lan
# @depends: python3

PORT=8080

echo "Starting AOCS dev server..."
echo "Local: http://localhost:$PORT/site/"
echo "LAN: http://aocs.lan:$PORT/site/"
echo ""
echo "Note: Access the site at /site/ path"
echo "Standard doc loads from /docs/AOCS.md"
echo ""
echo "Press Ctrl+C to stop"

cd "$(dirname "$0")"
python3 -m http.server $PORT
