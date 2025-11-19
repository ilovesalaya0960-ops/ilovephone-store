#!/bin/bash

# iLovePhone Store - Server Restart Script
# This script restarts both frontend and backend servers

echo "🔄 Restarting iLovePhone Store Servers..."
echo "========================================"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Stop servers
echo "Step 1: Stopping existing servers..."
"$SCRIPT_DIR/stop-servers.sh"

echo ""
echo "Step 2: Starting servers..."
sleep 2

# Start servers
"$SCRIPT_DIR/start-servers.sh"

exit 0

