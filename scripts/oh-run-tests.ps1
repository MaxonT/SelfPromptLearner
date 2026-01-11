$ErrorActionPreference = "Stop"

$logPath = "company\iterations\CURRENT\TEST_RESULTS.md"
if (-not (Test-Path $logPath)) {
  New-Item -ItemType File -Force -Path $logPath | Out-Null
}

Add-Content -Encoding utf8 -Path $logPath -Value ("`n## Ran at " + (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"))

function Run-Cmd([string]$cmd) {
  Add-Content -Encoding utf8 -Path $logPath -Value ("`n---`nCOMMAND: " + $cmd + "`n")
  $out = & cmd /c $cmd 2>&1
  Add-Content -Encoding utf8 -Path $logPath -Value (($out -join "`n") + "`n")
  return $LASTEXITCODE
}

$exit = 0

if (Test-Path "package.json") {
  if (Test-Path "pnpm-lock.yaml") { $exit = Run-Cmd "pnpm test" }
  elseif (Test-Path "yarn.lock") { $exit = Run-Cmd "yarn test" }
  else { $exit = Run-Cmd "npm test" }
}
elseif ((Test-Path "pyproject.toml") -or (Test-Path "requirements.txt")) {
  $exit = Run-Cmd "python -m pytest"
}
elseif (Test-Path "go.mod") {
  $exit = Run-Cmd "go test ./..."
}
else {
  Add-Content -Encoding utf8 -Path $logPath -Value "`nNo known test runner detected. Add real commands manually.`n"
  $exit = 0
}

if ($exit -ne 0) {
  Write-Host ("Tests exited non-zero. See: " + $logPath)
} else {
  Write-Host ("Tests logged: " + $logPath)
}
