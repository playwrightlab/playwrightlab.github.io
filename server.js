// Minimal zero-dependency static server with a real HTTP Basic Auth route.
// Start with: node server.js  (or: npm start)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const BASIC_AUTH_USER = "admin";
const BASIC_AUTH_PASS = "password123";
const REALM = "Playwright Demo Site - Restricted Area";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendAuthChallenge(res) {
  res.writeHead(401, {
    "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    "Content-Type": "text/html; charset=utf-8",
  });
  res.end(
    `<!doctype html><html><head><meta charset="utf-8"><title>401 Unauthorized</title></head>
     <body style="font-family:system-ui;text-align:center;padding:60px;">
       <h1>Not authorized</h1>
       <p>Correct credentials are required to view this page.</p>
     </body></html>`,
  );
}

function handleBasicAuth(req, res) {
  const header = req.headers["authorization"] || "";
  if (!header.startsWith("Basic ")) {
    return sendAuthChallenge(res);
  }
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf-8");
  const sep = decoded.indexOf(":");
  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);

  if (user === BASIC_AUTH_USER && pass === BASIC_AUTH_PASS) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      `<!doctype html><html><head><meta charset="utf-8"><title>Authorised</title></head>
       <body style="font-family:system-ui;text-align:center;padding:60px;">
         <h1 data-testid="auth-success" style="color:#16a34a;">You are authorised</h1>
         <p>Welcome, <strong>${user}</strong>. Basic authentication succeeded.</p>
         <p><a href="/index.html#modals">&larr; Back to the demo site</a></p>
       </body></html>`,
    );
    return;
  }
  return sendAuthChallenge(res);
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  // Prevent path traversal.
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const pathname = req.url.split("?")[0];
  if (pathname === "/basic-auth") {
    return handleBasicAuth(req, res);
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Demo site running at http://localhost:${PORT}`);
  console.log(`Basic auth route: http://localhost:${PORT}/basic-auth  (admin / password123)`);
});
