@echo off
echo ========================================
echo Launching Chrome with remote debugging
echo ========================================
echo.
echo This uses a SEPARATE Chrome profile for debugging.
echo Your regular Chrome can stay open!
echo.
echo FIRST TIME: You'll need to log into X in this Chrome window.
echo After that, it stays logged in.
echo.
pause
echo.
echo Launching Chrome...
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\chrome-debug-profile"
