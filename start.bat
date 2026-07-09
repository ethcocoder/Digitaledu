@echo off
title DigitalEdu Dev Server

echo ============================================
echo   DigitalEdu - Development Server Launcher
echo ============================================
echo.

REM Check if node_modules exists
if not exist "%~dp0node_modules" (
    echo [ERROR] node_modules not found.
    echo Run: pnpm install
    echo.
    pause
    exit /b 1
)

REM Kill any existing process on port 3000
echo [INFO] Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 "') do (
    if not "%%a"=="0" (
        echo [INFO] Killing process on port 3000 (PID: %%a)
        taskkill /f /pid %%a >nul 2>&1
    )
)
timeout /t 2 /nobreak >nul

echo [INFO] Starting Vite dev server...
echo [INFO] Open http://localhost:3000 in your browser
echo [INFO] Press Ctrl+C to stop
echo.

cd /d "%~dp0"
npm run dev

pause
