@echo off
echo Starting Voice AI Assistant Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if OPENROUTER_API_KEY is set
if "%OPENROUTER_API_KEY%"=="" (
    echo WARNING: OPENROUTER_API_KEY environment variable is not set
    echo Please set it using: set OPENROUTER_API_KEY=your-api-key-here
    echo.
    set /p OPENROUTER_API_KEY=Enter your OpenRouter API key: 
    if "!OPENROUTER_API_KEY!"=="" (
        echo ERROR: API key is required
        pause
        exit /b 1
    )
)

echo Starting server on http://localhost:8787
echo Press Ctrl+C to stop the server
echo.

node server/server.js