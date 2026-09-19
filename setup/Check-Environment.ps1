# Read-only checks for Windows PowerShell 5.1+; no installs or configuration changes.
[CmdletBinding()]
param(
    [ValidateSet('Web', 'Java', 'SQL', 'React', 'Static', 'All')]
    [string]$Track = 'Web',
    [string]$TomcatHome = ''
)

$ErrorActionPreference = 'Continue'
$repoRoot = Split-Path -Parent $PSScriptRoot

function Show-Result([string]$State, [string]$Name, [string]$Detail) {
    Write-Host ('[{0}] {1}: {2}' -f $State, $Name, $Detail)
}

function Get-ToolVersion([string]$Command, [string]$VersionArg) {
    $tool = Get-Command $Command -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $tool) {
        Show-Result 'MISSING' $Command 'Not found on this terminal PATH. Reopen the terminal after installing.'
        return ''
    }
    try {
        $output = (& $tool.Source $VersionArg 2>&1 | ForEach-Object { $_.ToString() }) -join ' '
        if ($LASTEXITCODE -ne 0) {
            Show-Result 'CHECK' $Command ('Version command failed: ' + $output)
            return ''
        }
        Show-Result 'INFO' $Command ($tool.Source + ' | ' + $output)
        return $output
    } catch {
        Show-Result 'CHECK' $Command $_.Exception.Message
        return ''
    }
}

function Test-LocalPort([int]$Port, [string]$Name) {
    $client = New-Object System.Net.Sockets.TcpClient
    $pending = $null
    try {
        $pending = $client.BeginConnect('127.0.0.1', $Port, $null, $null)
        if ($pending.AsyncWaitHandle.WaitOne(1000)) {
            $client.EndConnect($pending)
            Show-Result 'INFO' $Name ("127.0.0.1:$Port is open; this does not verify the service identity or login.")
        } else {
            Show-Result 'CHECK' $Name ("Port $Port is closed or timed out. Start the service when needed.")
        }
    } catch {
        Show-Result 'CHECK' $Name ("Port $Port is closed. Start the service when needed.")
    } finally {
        if ($pending) { $pending.AsyncWaitHandle.Close() }
        $client.Close()
    }
}

Write-Host "Study environment check | Track: $Track | $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
Write-Host 'Read-only. A first successful exercise is still required. No credentials are read.'
$null = Get-ToolVersion 'git.exe' '--version'

if ($Track -in @('Web', 'Java', 'All')) {
    $java = Get-ToolVersion 'java.exe' '-version'
    $javac = Get-ToolVersion 'javac.exe' '-version'
    if ($java -match 'version "21[."]' -and $javac -match '^javac 21(?:\.|\s|$)') {
        Show-Result 'PASS' 'JDK' 'java and javac both report 21.'
    } else {
        Show-Result 'CHECK' 'JDK' 'This course uses Java 21 for both java and javac.'
    }
    if ($env:JAVA_HOME -and (Test-Path -LiteralPath (Join-Path $env:JAVA_HOME 'bin\javac.exe'))) {
        Show-Result 'INFO' 'JAVA_HOME' $env:JAVA_HOME
        Show-Result 'CHECK' 'IDE JDK' 'Confirm Eclipse JavaSE-21 and Tomcat JRE point to this JDK 21; PATH alone is not enough.'
    } else {
        Show-Result 'CHECK' 'JAVA_HOME' 'Set it to the actual JDK 21 directory (not its bin directory).'
    }
}

if ($Track -in @('React', 'All')) {
    $nodeVersion = Get-ToolVersion 'node.exe' '--version'
    $null = Get-ToolVersion 'npm.cmd' '--version'
    if ($nodeVersion -match '^v24\.') {
        Show-Result 'PASS' 'Node.js' '24 LTS selected for this setup guide.'
    } else {
        Show-Result 'CHECK' 'Node.js' 'Recommended setup: Node 24 LTS. Previous laptop version was not recorded.'
    }
}

if ($Track -in @('Web', 'All')) {
    foreach ($project in @('01_userboard_sepa', '02_hkboard_MVC1')) {
        $lib = Join-Path $repoRoot "Back_end\web_edu_project\$project\src\main\webapp\WEB-INF\lib"
        $jars = @(Get-ChildItem -LiteralPath $lib -Filter 'mariadb-java-client-*.jar' -File -ErrorAction SilentlyContinue)
        if ($jars.Count -eq 1 -and $jars[0].Length -gt 0) {
            Show-Result 'PASS' $project ('JDBC file present: ' + $jars[0].Name + ' (contents not validated)')
        } else {
            Show-Result 'CHECK' $project ("Expected one non-empty Connector/J JAR in $lib; found $($jars.Count).")
        }
    }
    if ($TomcatHome) {
        $versionScript = Join-Path $TomcatHome 'bin\version.bat'
        if (Test-Path -LiteralPath $versionScript) {
            $versionText = (& $versionScript 2>&1 | ForEach-Object { $_.ToString() }) -join ' '
            if ($LASTEXITCODE -eq 0 -and $versionText -match 'Apache Tomcat/10\.1\.') {
                Show-Result 'PASS' 'Tomcat' $versionText
            } else { Show-Result 'CHECK' 'Tomcat' $versionText }
        } else { Show-Result 'MISSING' 'Tomcat' 'bin\version.bat not found under the supplied TomcatHome.' }
    } else {
        Show-Result 'CHECK' 'Tomcat' 'Optional: supply -TomcatHome with the extracted Tomcat 10.1 directory.'
    }
    Test-LocalPort 8080 'Web server'
}

if ($Track -in @('Web', 'SQL', 'All')) { Test-LocalPort 3306 'Database' }
Write-Host 'Next: follow setup/index.html and verify a real exercise in the selected track.'
