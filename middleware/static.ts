export async function serveStatic(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/assets/")) {
    return new Response(Bun.file(`./src${pathname}`));
  }

  return null;
}
