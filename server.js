const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

http
  .createServer((req, res) => {
    const cleanPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
    const filePath = path.normalize(path.join(root, cleanPath === "/" ? "index.html" : cleanPath));

    if (!filePath.startsWith(root)) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        send(res, 404, "Not found");
        return;
      }

      send(res, 200, content, types[path.extname(filePath)] || "application/octet-stream");
    });
  })
  .listen(port, () => {
    console.log(`GiftNest preview running at http://localhost:${port}`);
  });
