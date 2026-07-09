import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { handleCreateUser, handleDeleteUser, handleFixUserClaims } from "./api-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // API routes
  app.post("/api/create-user", async (req, res) => {
    const wrapRes = { writeHead: (status: number, headers?: any) => { res.writeHead(status, headers); }, end: (msg: string) => res.end(msg) };
    await handleCreateUser(req.body, wrapRes);
  });

  app.post("/api/delete-user", async (req, res) => {
    const wrapRes = { writeHead: (status: number, headers?: any) => { res.writeHead(status, headers); }, end: (msg: string) => res.end(msg) };
    await handleDeleteUser(req.body, wrapRes);
  });

  app.post("/api/fix-user-claims", async (req, res) => {
    const wrapRes = { writeHead: (status: number, headers?: any) => { res.writeHead(status, headers); }, end: (msg: string) => res.end(msg) };
    await handleFixUserClaims(req.body, wrapRes);
  });

  // Serve static files
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Production server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
