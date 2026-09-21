@echo off
title Control-Universe-Dev
cd /d "%~dp0"

echo ========================================
echo   Control Universe Wiki - Dev Server
echo   http://127.0.0.1:8080
echo   Close this window to stop server
echo ========================================
echo.

echo Checking port 8080...
powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -Command "try{$c=Get-NetTCPConnection -LocalPort 8080 -EA Stop; $pids=$c|%%{$_.OwningProcess}|Sort-Object -Unique; foreach($p in $pids){Stop-Process -Id $p -Force -EA SilentlyContinue}; if($pids){Write-Host 'Killed existing process on port 8080, restarting...'}else{Write-Host 'Port 8080 is free'}}catch{Write-Host 'Port 8080 is free'}"
echo.

set "tmp_ps=%temp%\cu_mon_%random%.ps1"

echo $t = 'Control-Universe-Dev' > "%tmp_ps%"
echo while(Get-Process ^| Where-Object {$_.MainWindowTitle -eq $t}) { >> "%tmp_ps%"
echo   Start-Sleep -Seconds 2 >> "%tmp_ps%"
echo } >> "%tmp_ps%"
echo try{Get-NetTCPConnection -LocalPort 8080 -EA Stop ^| %%{Stop-Process -Id $_.OwningProcess -Force -EA SilentlyContinue}}catch{} >> "%tmp_ps%"

start "" /b powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "%tmp_ps%"

start "" cmd /c "timeout /t 6 /nobreak >nul && start "" http://127.0.0.1:8080"

call npm run dev

del "%tmp_ps%" 2>nul

:wait
timeout /t 3600 /nobreak >nul
goto wait
