#!/bin/bash

# iLovePhone Store - Open Website Script
# This script opens the website in your default browser

echo "🌐 Opening iLovePhone Store Website..."
echo "========================================"

# Check if servers are running
if ! lsof -i :8000 > /dev/null 2>&1 || ! lsof -i :5001 > /dev/null 2>&1; then
    echo "⚠️  Servers are not running. Starting them first..."
    cd "$(dirname "$0")"
    ./start-servers.sh
    sleep 3
fi

# Open in browser
if command -v open &> /dev/null; then
    # macOS
    echo "📱 Opening in default browser..."
    open http://localhost:8000
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:8000
elif command -v start &> /dev/null; then
    # Windows (Git Bash)
    start http://localhost:8000
else
    echo "❌ Cannot open browser automatically"
    echo "📋 Please open this URL manually:"
    echo "   http://localhost:8000"
fi

echo ""
echo "✅ Done!"
echo "========================================"

exit 0

