import fs from "fs/promises";
import path from "path";
import app from "./src/server.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const HOST = "0.0.0.0";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const frontendDist = path.resolve(__dirname, "../frontend/dist");
const frontendIndex = path.resolve(__dirname, "../frontend/index.html");

async function findIndex() {
  const candidates = [
    path.join(frontendDist, "index.html"),
    frontendIndex
  ];
  for (const p of candidates) {
    try {
      const stat = await fs.stat(p);
      if (stat.isFile()) return p;
    } catch (err) {
      // ignore and continue
    }
  }
  return null;
}

// Only apply the injection middleware if an index.html exists
app.use(async (req, res, next) => {
  // Only handle GET requests for html (so API routes are unaffected)
  if (req.method !== "GET") return next();

  const indexPath = await findIndex();
  if (!indexPath) return next();

  // If path seems like an asset (has an extension), let static middleware / next handle it
  if (/\.[a-zA-Z0-9]{1,6}$/.test(req.path)) return next();

  try {
    let html = await fs.readFile(indexPath, "utf8");

    // Determine API URL to inject:
    // Prefer an explicit environment variable API_URL; otherwise use a sensible default derived from the request.
    const apiUrl = process.env.API_URL || `${req.protocol}://${req.get("host")}/api`;

    // Inject a script that sets window.API
    const injection = `<script>window.API = ${JSON.stringify(apiUrl)};</script>`;

    // Inject before </head> if present, otherwise before <body>, otherwise prepend
    if (html.includes("</head>")) {
      html = html.replace("</head>", `${injection}</head>`);
    } else if (html.includes("<body")) {
      html = html.replace(/<body([^>]*)>/i, `<body$1>${injection}`);
    } else {
      html = injection + html;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
  } catch (err) {
    return next(err);
  }
});

// Start listening (Cloud Run expects the process to listen on process.env.PORT)
app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, exiting");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("SIGINT received, exiting");
  process.exit(0);
});