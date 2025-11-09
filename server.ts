import { serveStatic } from "./middleware/static";
import { logger } from "./middleware/logger";
import { handlePageRoutes } from "@/routes/pages";
import { handleApiRoutes } from "@/api/expenses";

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const startTime = Date.now();
    const staticResponse = await serveStatic(req);
    if (staticResponse) {
      logger(req, startTime, staticResponse);
      return staticResponse;
    }
    const url = new URL(req.url);
    if (url.pathname === "/index.js") {
      const buildOutput = await Bun.build({
        entrypoints: ["./src/BrowserEntry.tsx"],
      });
      return new Response(await buildOutput.outputs[0]?.text(), {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    // API routes
    const apiResponse = await handleApiRoutes(req, url);
    if (apiResponse) {
      logger(req, startTime, apiResponse);
      return apiResponse;
    }

    // page routes
    const pageResponse = await handlePageRoutes(url);
    if (pageResponse) {
      logger(req, startTime, pageResponse);
      return pageResponse;
    }

    // 404
    const response = new Response("Page not found", { status: 404 });
    logger(req, startTime, response);
    return response;
  },
});

console.log(`Server running at ${server.url}`);
