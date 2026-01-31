@echo off
REM NudgeSafe Hands - Setup Script for Windows
REM This script automates the initial project setup

echo.
echo ========================================
echo   NudgeSafe Hands - Setup Script
echo   Version 1.0.0
echo ========================================
echo.

REM Check Node.js
echo [1/8] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download from: https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo   Node.js OK

REM Check Python
echo.
echo [2/8] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please download from: https://www.python.org/
    pause
    exit /b 1
)
python --version
echo   Python OK

REM Check Git
echo.
echo [3/8] Checking Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please download from: https://git-scm.com/
    pause
    exit /b 1
)
git --version
echo   Git OK

REM Create Python virtual environment
echo.
echo [4/8] Creating Python virtual environment...
if exist .venv (
    echo   Virtual environment already exists, skipping...
) else (
    python -m venv .venv
    echo   Virtual environment created
)

REM Activate virtual environment and install Python dependencies
echo.
echo [5/8] Installing Python dependencies...
call .venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
echo   Python dependencies installed

REM Install Node.js dependencies
echo.
echo [6/8] Installing Node.js dependencies...
call npm install
echo   Node.js dependencies installed

REM Create .env file if it doesn't exist
echo.
echo [7/8] Setting up environment variables...
if exist .env (
    echo   .env file already exists, skipping...
) else (
    copy .env.example .env
    echo   .env file created from template
    echo   IMPORTANT: Edit .env file with your actual values!
)

REM Initialize Git hooks (if needed)
echo.
echo [8/8] Configuring Git...
git config core.autocrlf true
git config pull.rebase false
echo   Git configuration updated

echo.
echo ========================================
echo   Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo   1. Edit .env file with your configuration
echo   2. Run: npm run dev (to start development server)
echo   3. Open: http://localhost:3000
echo.
echo For more information, see:
echo   - README.md
echo   - docs/DEV-SETUP-GUIDE.md
echo.
echo Happy coding! 🚀
echo.
pause
