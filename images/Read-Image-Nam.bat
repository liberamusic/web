@echo off
setlocal enabledelayedexpansion

echo ============================================
echo Bat dau duyet tat ca folder va subfolder trong thu muc hien tai
echo ============================================

:: Duyet de quy tat ca file anh trong cay thu muc
for /r %%D in (*.jpg *.jpeg *.png *.gif *.webp *.bmp *.ico) do (
    echo Folder: %%~dpD
    echo   File: %%~nxD
)

echo ============================================
echo Ket thuc danh sach file trong tat ca folder va subfolder
echo.
echo Nhan phim bat ky de thoat...
pause >nul
