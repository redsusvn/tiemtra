@echo off
chcp 65001 >nul
title Tiệm Trà Nhỏ - Hack Mod Menu Launcher
cd /d "%~dp0"

echo ============================================================
echo   🍵 Đang khởi chạy Game Tiệm Trà Nhỏ + Hack Mod Menu...
echo ============================================================
echo.

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Đang chạy với máy chủ Node.js (Port 8085)...
    start "" "http://localhost:8085/"
    node server.js
    goto end
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Đang chạy với Python...
    start "" "http://localhost:8085/"
    python -m http.server 8085
    goto end
)

echo [LỖI] Không tìm thấy Node.js hoặc Python trên máy.
echo Đang mở trực tiếp index.html bằng trình duyệt...
start "" "index.html"

:end
