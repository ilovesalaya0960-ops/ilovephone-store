#!/bin/bash

# iLovePhone Store - Server Status Check Script
# This script checks the status of both servers

echo "🔍 Checking iLovePhone Store Servers..."
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if port is in use
check_port() {
    local port=$1
    local name=$2
    local pid=$(lsof -t -i:$port 2>/dev/null)
    
    if [ ! -z "$pid" ]; then
        echo -e "${GREEN}✅ $name${NC}"
        echo -e "   Port: $port | PID: $pid"
        
        # Test HTTP response
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port --max-time 2 > /tmp/http_check 2>&1; then
            local http_code=$(cat /tmp/http_check)
            if [ "$http_code" = "200" ]; then
                echo -e "   ${GREEN}HTTP: $http_code (OK)${NC}"
            else
                echo -e "   ${YELLOW}HTTP: $http_code${NC}"
            fi
        else
            echo -e "   ${RED}HTTP: No response${NC}"
        fi
        return 0
    else
        echo -e "${RED}❌ $name${NC}"
        echo -e "   Port: $port | Status: Not running"
        return 1
    fi
}

# Check Frontend
echo ""
echo -e "${BLUE}📱 Frontend Server (Port 8000)${NC}"
FRONTEND_OK=$(check_port 8000 "Frontend Server")

# Check Backend
echo ""
echo -e "${BLUE}🔧 Backend API Server (Port 5001)${NC}"
BACKEND_OK=$(check_port 5001 "Backend API")

# Summary
echo ""
echo "========================================"

if lsof -i :8000 > /dev/null 2>&1 && lsof -i :5001 > /dev/null 2>&1; then
    echo -e "${GREEN}🎉 All servers are running!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Access URLs:${NC}"
    echo "   Frontend: http://localhost:8000"
    echo "   Backend:  http://localhost:5001"
else
    echo -e "${RED}⚠️  Some servers are not running${NC}"
    echo ""
    echo -e "${YELLOW}To start servers:${NC}"
    echo "   ./start-servers.sh"
fi

echo "========================================"

exit 0

