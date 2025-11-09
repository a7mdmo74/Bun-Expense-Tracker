export async function serveStatic(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/assets/")) {
    return new Response(Bun.file(`./src${pathname}`));
  }

  if (pathname === "/client.js") {
    const bundle = await Bun.build({
      entrypoints: ["./src/client/client.tsx"],
      target: "browser",
      format: "esm",
    });

    if (!bundle.success) {
      console.error("❌ Client build failed:", bundle.logs);
      return new Response("Client build failed", { status: 500 });
    }

    return new Response(await bundle.outputs[0]?.text(), {
      headers: { "Content-Type": "application/javascript" },
    });
  }

  return null;
}
