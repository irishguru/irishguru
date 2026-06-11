$root = Split-Path -Parent $PSScriptRoot
$pages = @('about', 'services', 'industries', 'case-studies', 'contact')

function RootLinks([string]$html) {
    $html = $html -replace 'href="index\.html"', 'href="./"'
    $html = $html -replace 'href="about\.html', 'href="about/'
    $html = $html -replace 'href="services\.html', 'href="services/'
    $html = $html -replace 'href="industries\.html', 'href="industries/'
    $html = $html -replace 'href="case-studies\.html', 'href="case-studies/'
    $html = $html -replace 'href="contact\.html', 'href="contact/'
    return $html
}

function InnerLinks([string]$html, [string]$page) {
    $html = $html -replace 'href="css/', 'href="../css/'
    $html = $html -replace 'href="favicon\.svg"', 'href="../favicon.svg"'
    $html = $html -replace 'src="js/', 'src="../js/'
    $html = $html -replace 'href="index\.html"', 'href="../"'
    $html = $html -replace 'href="about\.html', 'href="../about/'
    $html = $html -replace 'href="services\.html', 'href="../services/'
    $html = $html -replace 'href="industries\.html', 'href="../industries/'
    $html = $html -replace 'href="case-studies\.html', 'href="../case-studies/'
    $html = $html -replace 'href="contact\.html', 'href="../contact/'
    $html = $html -replace "https://irishguru\.com/$page\.html", "https://irishguru.com/$page/"
    return $html
}

$indexPath = Join-Path $root 'index.html'
[IO.File]::WriteAllText($indexPath, (RootLinks ([IO.File]::ReadAllText($indexPath))))

foreach ($page in $pages) {
    $src = Join-Path $root "$page.html"
    if (-not (Test-Path $src)) { continue }

    $dir = Join-Path $root $page
    New-Item -ItemType Directory -Force -Path $dir | Out-Null

    $html = InnerLinks ([IO.File]::ReadAllText($src)) $page
    [IO.File]::WriteAllText((Join-Path $dir 'index.html'), $html)
    Remove-Item $src

    $stub = @"
<!DOCTYPE html>
<html lang="en-IE">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=$page/">
  <link rel="canonical" href="https://irishguru.com/$page/">
  <script>location.replace('$page/');</script>
  <title>Redirecting…</title>
</head>
<body><p><a href="$page/">Continue to $page</a></p></body>
</html>
"@
    [IO.File]::WriteAllText($src, $stub)
}

$p404 = Join-Path $root '404.html'
if (Test-Path $p404) {
    $html = [IO.File]::ReadAllText($p404)
    $html = $html -replace 'href="index\.html"', 'href="./"'
    $html = $html -replace 'href="contact\.html"', 'href="contact/"'
    [IO.File]::WriteAllText($p404, $html)
}

Write-Output 'Clean URL migration complete.'
