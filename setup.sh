#!/bin/bash
# NudgeSafe Hands - Setup Script for Linux/Mac
# This script automates the initial project setup

echo ""
echo "========================================"
echo "  NudgeSafe Hands - Setup Script"
echo "  Version 1.0.0"
echo "========================================"
echo ""

# Check Node.js
echo "[1/8] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install from: https://nodejs.org/"
    exit 1
fi
node --version
echo "  ✓ Node.js OK"

# Check Python
echo ""
echo "[2/8] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed!"
    echo "Please install from: https://www.python.org/"
    exit 1
fi
python3 --version
echo "  ✓ Python OK"

# Check Git
echo ""
echo "[3/8] Checking Git installation..."
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed!"
    echo "Please install from: https://git-scm.com/"
    exit 1
fi
git --version
echo "  ✓ Git OK"

# Create Python virtual environment
echo ""
echo "[4/8] Creating Python virtual environment..."
if [ -d ".venv" ]; then
    echo "  Virtual environment already exists, skipping..."
else
    python3 -m venv .venv
    echo "  ✓ Virtual environment created"
fi

# Activate virtual environment and install Python dependencies
echo ""
echo "[5/8] Installing Python dependencies..."
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "  ✓ Python dependencies installed"

# Install Node.js dependencies
echo ""
echo "[6/8] Installing Node.js dependencies..."
npm install
echo "  ✓ Node.js dependencies installed"

# Create .env file
echo ""
echo "[7/8] Setting up environment variables..."
if [ -f ".env" ]; then
    echo "  .env file already exists, skipping..."
else
    cp .env.example .env
    echo "  ✓ .env file created from template"
    echo "  ⚠️  IMPORTANT: Edit .env file with your actual values!"
fi

# Configure Git
echo ""
echo "[8/8] Configuring Git..."
git config pull.rebase false
echo "  ✓ Git configuration updated"

echo ""
echo "========================================"
echo "  Setup completed successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your configuration"
echo "  2. Run: npm run dev (to start development server)"
echo "  3. Open: http://localhost:3000"
echo ""
echo "For more information, see:"
echo "  - README.md"
echo "  - docs/DEV-SETUP-GUIDE.md"
echo ""
echo "Happy coding! 🚀"
echo ""
