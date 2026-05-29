import { createReadStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { basename, extname, join, resolve, sep } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { effectivePiWebConfig } from "./src/config";
import { ProjectStore } from "./src/server/storage/projectStore";
import { ProjectService } from "./src/server/projects/projectService";
import { WorkspaceService } from "./src/server/workspaces/workspaceService";
import { resolveWorkspaceContext } from "./src/server/workspaces/workspaceContext";
import { writeWorkspaceFile } from "./src/server/workspaces/fileContentService";
import { resolveInsideWorkspace } from "./src/server/workspaces/pathSafety";

const { config } = effectivePiWebConfig();
const apiPort = config.port ?? 8504;
const docsRoot = resolve("docs");
const docsPrefix = "/site";

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
};

type MiddlewareNext = (error?: unknown) => void;

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

const FILE_RE = /^\/api\/projects\/([^/]+)\/workspaces\/([^/]+)\/file(\/upload|\/download)?$/;

function apiWriteFilePlugin(): Plugin {
  return {
    name: "pi-web-api-write-file",
    apply: "serve",
    async configureServer(server) {
      const projects = new ProjectService(new ProjectStore());
      const workspaces = new WorkspaceService();

      server.middlewares.use(async (req, res, next) => {
        if (!req.url) { next(); return; }
        const url = new URL(req.url, "http://localhost");
        const match = url.pathname.match(FILE_RE);
        if (!match) { next(); return; }

        const projectId = decodeURIComponent(match[1]);
        const workspaceId = decodeURIComponent(match[2]);
        const action = match[3];

        try {
          const ctx = await resolveWorkspaceContext(projects, workspaces, projectId, workspaceId);

          // PUT /file?path=  -- write text file
          if (req.method === "PUT" && action === undefined) {
            const filePath = url.searchParams.get("path");
            const body = await readRequestBody(req);
            const { content } = JSON.parse(body) as { content: string };
            const result = await writeWorkspaceFile(ctx.root, filePath ?? undefined, content);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
            return;
          }

          // POST /file/upload?path=<dir>  -- upload file (base64)
          if (req.method === "POST" && action === "/upload") {
            const dir = url.searchParams.get("path") ?? ".uploads";
            const body = await readRequestBody(req);
            const { name, content } = JSON.parse(body) as { name: string; content: string };
            const buf = Buffer.from(content, "base64");
            const targetDir = join(ctx.root, dir);
            await mkdir(targetDir, { recursive: true });
            const { writeFile } = await import("node:fs/promises");
            const dest = join(targetDir, basename(name));
            await writeFile(dest, buf);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ path: join(dir, basename(name)), size: buf.length, ok: true }));
            return;
          }

          // GET /file/download?path=<file>  -- download file
          if (req.method === "GET" && action === "/download") {
            const filePath = url.searchParams.get("path");
            if (!filePath) throw new Error("path query parameter is required");
            const { target } = await resolveInsideWorkspace(ctx.root, filePath);
            const s = await stat(target);
            const name = basename(filePath);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/octet-stream");
            res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}"`);
            res.setHeader("Content-Length", String(s.size));
            createReadStream(target).pipe(res);
            return;
          }

          next();
        } catch (error) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
        }
      });
    },
  };
}

async function serveDevDocs(request: IncomingMessage, response: ServerResponse, next: MiddlewareNext): Promise<void> {
  const requestUrl = request.url;
  if (requestUrl === undefined) {
    next();
    return;
  }

  const url = new URL(requestUrl, "http://localhost");
  if (url.pathname === docsPrefix) {
    response.statusCode = 302;
    response.setHeader("Location", `${docsPrefix}/`);
    response.end();
    return;
  }
  if (!url.pathname.startsWith(`${docsPrefix}/`)) {
    next();
    return;
  }

  const relativePath = decodeURIComponent(url.pathname.slice(docsPrefix.length + 1)) || "index.html";
  const requestedPath = relativePath.endsWith("/") ? join(relativePath, "index.html") : relativePath;
  const filePath = resolve(docsRoot, requestedPath);
  if (filePath !== docsRoot && !filePath.startsWith(`${docsRoot}${sep}`)) {
    response.statusCode = 403;
    response.end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      response.statusCode = 404;
      response.end("Not found");
      return;
    }
    response.statusCode = 200;
    response.setHeader("Content-Type", contentTypes[extname(filePath)] ?? "application/octet-stream");
    response.setHeader("Cache-Control", "no-store");
    createReadStream(filePath).pipe(response);
  } catch (error) {
    const code = error instanceof Error && "code" in error ? error.code : undefined;
    if (code === "ENOENT") {
      response.statusCode = 404;
      response.end("Not found");
      return;
    }
    next(error);
  }
}

function devDocsPlugin(): Plugin {
  return {
    name: "pi-web-dev-docs",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        void serveDevDocs(request, response, next);
      });
    },
  };
}

export default defineConfig({
  plugins: [apiWriteFilePlugin(), devDocsPlugin()],
  root: "src/client",
  build: {
    outDir: "../../dist/client",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@codemirror/legacy-modes")) return "vendor-editor-legacy";
          if (id.includes("@lezer/common") || id.includes("@lezer/highlight") || id.includes("@lezer/lr")) return "vendor-editor-core";
          if (id.includes("@codemirror/lang-") || id.includes("@lezer/")) return "vendor-editor-languages";
          if (id.includes("@codemirror") || id.includes("codemirror")) return "vendor-editor-core";
          if (id.includes("@xterm")) return "vendor-terminal";
          return undefined;
        },
      },
    },
  },
  server: {
    port: 8505,
    strictPort: true,
    ...(config.allowedHosts === undefined ? {} : { allowedHosts: config.allowedHosts }),
    proxy: {
      "/api": { target: `http://localhost:${String(apiPort)}`, ws: true },
      "/pi-web-plugins": { target: `http://localhost:${String(apiPort)}` },
    },
  },
});
