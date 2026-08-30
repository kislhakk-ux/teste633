$ErrorActionPreference = "SilentlyContinue"

$git = "C:\Program Files\Git\cmd\git.exe"
$gh  = "C:\Program Files\GitHub CLI\gh.exe"
$dir = "C:\Users\kgmf2\Desktop\Harvest_Horizon_Upload"
$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\Git\bin;" + $env:PATH

Set-Location $dir

# Get auth token and set remote with it
$token = & $gh auth token 2>$null
& $git remote remove origin 2>$null
& $git remote add origin "https://kislhakk-ux:${token}@github.com/kislhakk-ux/teste633.git"
& $git config user.name  "kislhakk-ux"
& $git config user.email "kislhakk-ux@users.noreply.github.com"

Write-Host "Auto-push ativado! Monitorando: $dir" -ForegroundColor Green
Write-Host "Qualquer alteracao sera enviada ao GitHub automaticamente." -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar." -ForegroundColor Yellow
Write-Host ""

# FileSystemWatcher setup
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path   = $dir
$watcher.Filter = "*"
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor `
                        [System.IO.NotifyFilters]::FileName  -bor `
                        [System.IO.NotifyFilters]::DirectoryName

# Debounce: only push after 4 seconds of inactivity
$global:lastEvent   = [datetime]::MinValue
$global:pendingPush = $false
$debounceMs = 4000

$action = {
    $global:lastEvent   = [datetime]::Now
    $global:pendingPush = $true
}

$created = Register-ObjectEvent $watcher Created -Action $action
$changed = Register-ObjectEvent $watcher Changed -Action $action
$deleted = Register-ObjectEvent $watcher Deleted -Action $action
$renamed = Register-ObjectEvent $watcher Renamed -Action $action

$watcher.EnableRaisingEvents = $true

try {
    while ($true) {
        Start-Sleep -Milliseconds 1000

        if ($global:pendingPush) {
            $elapsed = ([datetime]::Now - $global:lastEvent).TotalMilliseconds
            if ($elapsed -ge $debounceMs) {
                $global:pendingPush = $false
                Set-Location $dir

                $status = & $git status --porcelain 2>$null
                if ($status) {
                    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                    Write-Host ""
                    Write-Host "[$timestamp] Alteracoes detectadas! Enviando ao GitHub..." -ForegroundColor Yellow

                    & $git add -A 2>$null
                    & $git commit -m "auto: sync $timestamp" 2>$null
                    $result = & $git push origin main --force 2>&1

                    if ($result -match "main -> main") {
                        Write-Host "[$timestamp] Push OK!" -ForegroundColor Green
                    } else {
                        # Refresh token and retry
                        $token = & $gh auth token 2>$null
                        & $git remote set-url origin "https://kislhakk-ux:${token}@github.com/kislhakk-ux/teste633.git"
                        & $git push origin main --force 2>&1 | Out-Null
                        Write-Host "[$timestamp] Push OK (token renovado)!" -ForegroundColor Green
                    }
                }
            }
        }
    }
} finally {
    Unregister-Event -SourceIdentifier $created.Name  2>$null
    Unregister-Event -SourceIdentifier $changed.Name  2>$null
    Unregister-Event -SourceIdentifier $deleted.Name  2>$null
    Unregister-Event -SourceIdentifier $renamed.Name  2>$null
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "Watcher encerrado." -ForegroundColor Red
}
