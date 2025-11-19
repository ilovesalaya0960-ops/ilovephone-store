#!/bin/bash

# iLovePhone Store - Server Stop Script
# This script stops both frontend and backend servers

echo "🛑 Stopping iLovePhone Store Servers..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill process on port
kill_port() {
    local port=$1
    local name=$2
    local pid=$(lsof -t -i:$port)
    
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}⚠️  Stopping $name on port $port (PID: $pid)...${NC}"
        kill -9 $pid 2>/dev/null
        sleep 1
        
        if lsof -i :$port > /dev/null 2>&1; then
            echo -e "${RED}❌ Failed to stop $name${NC}"
            return 1
        else
            echo -e "${GREEN}✅ $name stopped${NC}"
            return 0
        fi
    else
        echo -e "${YELLOW}ℹ️  $name is not running on port $port${NC}"
        return 0
    fi
}

# Stop Frontend Server
kill_port 8000 "Frontend Server"

# Stop Backend Server
kill_port 5001 "Backend API Server"

# Clean up PID files
rm -f /tmp/ilovephone-frontend.pid
rm -f /tmp/ilovephone-backend.pid

echo ""
echo "========================================"
echo -e "${GREEN}✅ All servers stopped${NC}"
echo "========================================"

exit 0

