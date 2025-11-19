#!/bin/bash

# iLovePhone Store - Server Startup Script
# This script starts both frontend and backend servers

echo "🚀 Starting iLovePhone Store Servers..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -t -i:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}⚠️  Port $port is in use (PID: $pid). Stopping...${NC}"
        kill -9 $pid 2>/dev/null
        sleep 1
        echo -e "${GREEN}✅ Port $port cleared${NC}"
    fi
}

# Check and clear ports
echo ""
echo -e "${BLUE}🔍 Checking ports...${NC}"
kill_port 8000
kill_port 5001

# Start Frontend Server (Python)
echo ""
echo -e "${BLUE}📱 Starting Frontend Server on http://localhost:8000${NC}"
cd "$SCRIPT_DIR"
python3 -m http.server 8000 > /tmp/frontend-server.log 2>&1 &
FRONTEND_PID=$!
sleep 2

if check_port 8000; then
    echo -e "${GREEN}✅ Frontend Server started (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}❌ Frontend Server failed to start${NC}"
    exit 1
fi

# Start Backend Server (Node.js)
echo ""
echo -e "${BLUE}🔧 Starting Backend API Server on http://localhost:5001${NC}"
cd "$SCRIPT_DIR/server"
node server.js > /tmp/backend-server.log 2>&1 &
BACKEND_PID=$!
sleep 3

if check_port 5001; then
    echo -e "${GREEN}✅ Backend API Server started (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Backend Server failed to start${NC}"
    echo -e "${YELLOW}📄 Check logs: tail -f /tmp/backend-server.log${NC}"
    exit 1
fi

# Summary
echo ""
echo "========================================"
echo -e "${GREEN}🎉 All servers started successfully!${NC}"
echo ""
echo -e "${BLUE}📍 Frontend:${NC} http://localhost:8000"
echo -e "${BLUE}📍 Backend API:${NC} http://localhost:5001"
echo ""
echo -e "${YELLOW}📄 Logs:${NC}"
echo "   Frontend: tail -f /tmp/frontend-server.log"
echo "   Backend:  tail -f /tmp/backend-server.log"
echo ""
echo -e "${YELLOW}🛑 To stop servers:${NC}"
echo "   ./stop-servers.sh"
echo "   or manually: kill $FRONTEND_PID $BACKEND_PID"
echo ""
echo "========================================"

# Save PIDs to file for stopping later
echo "$FRONTEND_PID" > /tmp/ilovephone-frontend.pid
echo "$BACKEND_PID" > /tmp/ilovephone-backend.pid

exit 0

