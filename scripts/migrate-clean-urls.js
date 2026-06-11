const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pages = ['about', 'services', 'industries', 'case-studies', 'contact'];

function rootLinks(html) {
  return html
    .replace(/href="index\.html"/g, 'href="./"')
    .replace(/href="about\.html/g, 'href="about/')
    .replace(/href="services\.html/g, 'href="services/')
    .replace(/href="industries\.html/g, 'href="industries/')
    .replace(/href="case-studies\.html/g, 'href="case-studies/')
    .replace(/href="contact\.html/g, 'href="contact/');
}

function innerLinks(html, page) {
  return html
    .replace(/href="css\//g, 'href="../css/')
    .replace(/href="favicon\.svg"/g, 'href="../favicon.svg"')
    .replace(/src="js\//g, 'src="../js/')
    .replace(/href="index\.html"/g, 'href="../"')
    .replace(/href="about\.html/g, 'href="../about/')
    .replace(/href="services\.html/g, 'href="../services/')
    .replace(/href="industries\.html/g, 'href="../industries/')
    .replace(/href="case-studies\.html/g, 'href="../case-studies/')
    .replace(/href="contact\.html/g, 'href="../contact/')
    .replace(
      new RegExp(`https://irishguru\\.com/${page}\\.html`, 'g'),
      `https://irishguru.com/${page}/`
    )
    .replace(
      /(<a href="\.\.\/">Home<\/a>)/,
      '<a href="../">Home</a>'
    );
}

// Update root index.html
const indexPath = path.join(root, 'index.html');
fs.writeFileSync(indexPath, rootLinks(fs.readFileSync(indexPath, 'utf8')));

// Move inner pages to folders
pages.forEach((page) => {
  const src = path.join(root, `${page}.html`);
  if (!fs.existsSync(src)) return;
  const dir = path.join(root, page);
  fs.mkdirSync(dir, { recursive: true });
  let html = fs.readFileSync(src, 'utf8');
  html = innerLinks(html, page);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  fs.unlinkSync(src);
});

// Redirect stubs for old .html URLs
pages.forEach((page) => {
  const stub = `<!DOCTYPE html>
<html lang="en-IE">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${page}/">
  <link rel="canonical" href="https://irishguru.com/${page}/">
  <script>location.replace('${page}/');</script>
  <title>Redirecting…</title>
</head>
<body><p><a href="${page}/">Continue to ${page}</a></p></body>
</html>`;
  fs.writeFileSync(path.join(root, `${page}.html`), stub);
});

// index.html redirect stub optional - skip, home is index.html at root

// Update 404
const p404 = path.join(root, '404.html');
if (fs.existsSync(p404)) {
  let html = fs.readFileSync(p404, 'utf8');
  html = html.replace('href="index.html"', 'href="./"').replace('href="contact.html"', 'href="contact/"');
  fs.writeFileSync(p404, html);
}

console.log('Clean URL migration complete.');
