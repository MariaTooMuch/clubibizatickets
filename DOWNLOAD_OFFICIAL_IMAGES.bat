@echo off
title Club Ibiza Tickets - Download Official Images
echo ============================================================
echo   Club Ibiza Tickets - Official Image Downloader
echo ============================================================
echo.
echo This will download the official event/club flyers from
echo ClubTickets.com and save them into the images\ folder,
echo then update index.html to use them.
echo.
echo You need internet access on THIS computer for this to work.
echo.
pause

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python "%~dp0scripts\download_official_images.py"
    goto :end
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    py "%~dp0scripts\download_official_images.py"
    goto :end
)

echo.
echo ERROR: Python was not found on this computer.
echo Please install Python from https://www.python.org/downloads/
echo ^(check "Add Python to PATH" during install^), then run this
echo file again.
echo.

:end
echo.
echo Done. Check the messages above for any failed downloads.
pause
