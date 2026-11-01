#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

echo "⚡ Starting Probe Full-Stack Suite..."
echo ""

# 1. Setup Backend Python Virtual Environment
if [ ! -d "$BACKEND_DIR/.venv" ]; then
    echo "📦 Creating Python virtual environment in backend/.venv..."
    python3 -m venv "$BACKEND_DIR/.venv"
    echo "⬇️  Installing backend dependencies..."
    "$BACKEND_DIR/.venv/bin/pip" install -e "$BACKEND_DIR"
fi

# Ensure .env exists in backend
if [ ! -f "$BACKEND_DIR/.env" ] && [ -f "$BACKEND_DIR/.env.example" ]; then
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
fi

# 2. Launch FastAPI Backend
echo "🚀 Starting FastAPI Backend at http://127.0.0.1:8000..."
cd "$BACKEND_DIR"
"$BACKEND_DIR/.venv/bin/uvicorn" probe.app:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd "$ROOT_DIR"

# Cleanup background process on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down Probe backend (PID: $BACKEND_PID)..."
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
    echo "✅ Shutdown complete."
}
trap cleanup EXIT INT TERM

# 3. Check Frontend Dependencies
if [ ! -d "$ROOT_DIR/node_modules" ]; then
    echo "📦 Installing frontend npm dependencies..."
    npm install
fi

# 4. Start Vite Frontend
echo "🌐 Starting Vite Frontend at http://127.0.0.1:5173..."
npm run dev -- --host 127.0.0.1
