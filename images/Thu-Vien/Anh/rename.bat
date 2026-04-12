@echo off
setlocal enabledelayedexpansion

echo Bat dau script...
::%folder%
:: Lấy tên folder hiện tại
for %%I in (.) do set "folder=%%~nxI"
set "prefix=%folder%-piano-tai-thai-nguyen-"

set counter=1
echo Bat dau duyet file...

for %%f in (*.jpg *.jpeg *.png *.gif *.webp *.bmp *.ico) do (
    echo Tim thay file: %%f
    set "newname=%prefix%!counter!%%~xf"
    echo Doi ten thanh: !newname!
    rename "%%f" "!newname!"
    set /a counter+=1
)

echo Hoan tat!
echo.
echo Nhan ESC de thoat, hoac phim bat ky de tiep tuc vong lap...

:waitloop
:: Đọc một phím từ bàn phím
set "key="
for /f "delims=" %%A in ('xcopy /w /l "%~f0" "%~f0" 2^>nul') do (
    set "key=%%A"
    goto checkkey
)

:checkkey
:: ESC có mã ASCII 27
if "%key%"=="" (
    echo ESC duoc nhan, thoat chuong trinh...
    goto :eof
) else (
    echo Ban da nhan phim khac, tiep tuc cho den khi ESC...
    goto waitloop
)
