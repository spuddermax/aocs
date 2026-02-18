#!/bin/bash
# @module: DevServer
# @purpose: Serve AOCS site locally
# @depends: python3

PORT=8080

echo "Starting AOCS dev server..."
echo ""
echo "  Site:     http://localhost:$PORT/site/"
echo "  Standard: http://localhost:$PORT/docs/AOCS.md"
echo ""
echo "Press Ctrl+C to stop"

cd "$(dirname "$0")"
python3 -m http.server $PORT
