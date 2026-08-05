@echo off
cd /d "%~dp0.."
echo [%date% %time%] Starting 08NT dev server on port 3000 > "%TEMP%\08nt-dev-3000.log"
"C:\Program Files\nodejs\npm.cmd" run dev -- -p 3000 >> "%TEMP%\08nt-dev-3000.log" 2>&1
echo [%date% %time%] Dev server stopped with exit code %ERRORLEVEL% >> "%TEMP%\08nt-dev-3000.log"
