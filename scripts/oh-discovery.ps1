$ErrorActionPreference = "Stop"

function Out-Line($s) { $s | Out-File -Encoding utf8 -Append -FilePath "company\iterations\CURRENT\DISCOVERY.md" }

Set-Content -Encoding utf8 -Path "company\iterations\CURRENT\DISCOVERY.md" -Value "# DISCOVERY (CURRENT)`n`n> Observed repo reality only. No guessing.`n`n"

Out-Line "## Timestamp"
Out-Line ("- " + (Get-Date).ToString("yyyy-MM-dd HH:mm:ss"))

Out-Line "`n## Top-level"
Get-ChildItem -Force -Directory | ForEach-Object { Out-Line ("- " + $_.Name + "/") }
Get-ChildItem -Force -File | ForEach-Object { Out-Line ("- " + $_.Name) }

Out-Line "`n## Key build/package descriptors (found)"
$keys = @("package.json","pnpm-lock.yaml","yarn.lock","bun.lockb","requirements.txt","pyproject.toml","Pipfile","poetry.lock","go.mod","Cargo.toml","pom.xml","build.gradle","Makefile","docker-compose.yml","Dockerfile",".github/workflows")
foreach ($k in $keys) {
  $found = Get-ChildItem -Recurse -Force -ErrorAction SilentlyContinue -Filter $k | Select-Object -First 10
  foreach ($f in $found) { Out-Line ("- " + $f.FullName.Replace((Get-Location).Path + "\", "")) }
}

# package.json scripts (best-effort)
$pkg = Get-ChildItem -Recurse -Force -ErrorAction SilentlyContinue -Filter "package.json" | Select-Object -First 1
if ($pkg) {
  Out-Line "`n## package.json scripts (first package.json)"
  try {
    $json = Get-Content -Raw -Path $pkg.FullName | ConvertFrom-Json
    if ($json.scripts) {
      $json.scripts.PSObject.Properties | ForEach-Object {
        Out-Line ("- " + $_.Name + ": " + $_.Value)
      }
    } else {
      Out-Line "- (no scripts field)"
    }
  } catch {
    Out-Line "- (failed to parse package.json)"
  }
}

Out-Line "`n## README hints (first README found)"
$readme = Get-ChildItem -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^(README)(\..*)?$' } | Select-Object -First 1
if ($readme) {
  Out-Line ("- " + $readme.FullName.Replace((Get-Location).Path + "\", ""))
} else {
  Out-Line "- (no README found)"
}

Out-Line "`n## Next (manual): confirm run/test commands"
Out-Line "- Fill PLAN.md after you confirm how to run and test."

Write-Host "Discovery written to: company\iterations\CURRENT\DISCOVERY.md ✅"
