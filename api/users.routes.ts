import { createUser, loginUser } from "../db/users";

export async function handleUsersApiRoutes(req: Request, url: URL) {
  if (!url.pathname.startsWith("/api/users")) return null;

  try {
    if (req.method === "POST" && url.pathname === "/api/users") {
      const { email, password } = await req.json();
      const user = await createUser(email, password); // expects { email, password }
      return Response.json(user, { status: 201 });
    }
    if (req.method === "POST" && url.pathname === "/api/users/login") {
      const body = await req.json();
      const { email, password } = body;

      if (!email || !password)
        return Response.json(
          { error: "Email and password required" },
          { status: 400 }
        );

      const user = await loginUser(email, password);
      if (!user)
        return Response.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );

      return Response.json(user);
    }

    return new Response("Not Found", { status: 404 });
  } catch (err) {
    console.error("API Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
