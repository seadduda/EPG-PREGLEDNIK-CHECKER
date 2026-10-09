@echo off
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nije pronadjen. Instalirajte Node.js da bi URL ucitavanje radilo.
  pause
  exit /b 1
)
powershell -NoProfile -WindowStyle Hidden -Command "$base='http://127.0.0.1:18765'; try { $healthy=(Invoke-RestMethod ($base + '/api/health') -TimeoutSec 1) -eq 'EPG-CHECKER-OK' } catch { $healthy=$false }; if (-not $healthy) { $script='%~dp0server.js'; Start-Process -FilePath 'node' -ArgumentList ('\"' + $script + '\"') -WorkingDirectory '%~dp0' -WindowStyle Hidden; Start-Sleep -Milliseconds 900 }; Start-Process ($base + '/')"
