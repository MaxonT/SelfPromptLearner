param([string]$Hook = "pre-commit")

$ErrorActionPreference = "Stop"

function Read-Json([string]$p) {
  if (-not (Test-Path $p)) { throw "Missing guardrails config: $p" }
  return (Get-Content -Raw -Path $p | ConvertFrom-Json)
}

function Fail([string]$msg) {
  Write-Host ""
  Write-Host "GUARDRAILS BLOCKED COMMIT"
  Write-Host $msg
  Write-Host ""
  exit 1
}

$cfg = Read-Json "company\guardrails\GUARDRAILS.json"

# override env var (dynamic name)
$overrideVar = [string]$cfg.allow_override_env_var
$overrideVal = [Environment]::GetEnvironmentVariable($overrideVar)

if ($overrideVal -eq "1") {
  Write-Host "GUARDRAILS OVERRIDE ENABLED"
  exit 0
}

# staged files
$staged = @(git diff --cached --name-only) | Where-Object { $_ -and $_.Trim() -ne "" }
if (-not $staged -or $staged.Count -eq 0) { exit 0 }

# max files cap
$maxFiles = [int]$cfg.max_files_per_iteration
if ($staged.Count -gt $maxFiles) {
  Fail ("Too many staged files (" + $staged.Count + ") > max_files_per_iteration (" + $maxFiles + ").")
}

# code-ish detection (treat md as non-code so planning commits are easy)
$codeExt = @(".js",".jsx",".ts",".tsx",".py",".go",".java",".cs",".rb",".php",".rs",".cpp",".c",".h",".sql",".sh",".ps1",".yml",".yaml",".toml",".json")

function Is-CodePath([string]$p) {
  $lp = $p.ToLowerInvariant()
  foreach ($e in $codeExt) { if ($lp.EndsWith($e)) { return $true } }
  return $false
}

$codeTouched = $false
foreach ($f in $staged) {
  if (Is-CodePath $f) { $codeTouched = $true; break }
}

# required artifacts only when code changes are staged
$required = @()
if ($codeTouched -and [bool]$cfg.enforce_plan_for_code_changes) { $required += "company/iterations/CURRENT/PLAN.md" }
if ($codeTouched -and [bool]$cfg.enforce_test_results_for_code_changes) { $required += "company/iterations/CURRENT/TEST_RESULTS.md" }
if ($codeTouched -and [bool]$cfg.enforce_security_review_for_code_changes) { $required += "company/iterations/CURRENT/SECURITY_REVIEW.md" }
if ($codeTouched -and [bool]$cfg.enforce_privacy_review_for_code_changes) { $required += "company/iterations/CURRENT/PRIVACY_REVIEW.md" }

foreach ($r in $required) {
  $rWin = $r -replace "/","\"
  if (-not (Test-Path $rWin)) { Fail ("Missing required artifact file: " + $r) }
  if ($staged -notcontains $r) { Fail ("Required artifact not staged: " + $r) }
}

# best-effort secret pattern scan in staged diff
$diff = (git diff --cached) -join "`n"
$secretPatterns = @(
  "(?i)api[_-]?key\s*=\s*['""][^'""]+['""]",
  "(?i)secret\s*=\s*['""][^'""]+['""]",
  "(?i)token\s*=\s*['""][^'""]+['""]",
  "(?i)BEGIN\s+PRIVATE\s+KEY"
)

foreach ($pat in $secretPatterns) {
  if ($diff -match $pat) {
    Fail ("Potential secret detected in staged diff (pattern: " + $pat + "). Remove/rotate and use secret registry.")
  }
}

Write-Host "Guardrails OK"
exit 0