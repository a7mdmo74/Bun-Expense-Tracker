import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../db/expense";

export async function handleExpenseApiRoutes(req: Request, url: URL) {
  if (!url.pathname.startsWith("/api/expenses")) return null;

  try {
    if (req.method === "GET" && url.pathname === "/api/expenses") {
      const expenses = await getExpenses();
      return Response.json(expenses);
    }

    if (req.method === "GET" && /^\/api\/expenses\/\d+$/.test(url.pathname)) {
      const id = parseInt(url.pathname.split("/").pop()!);
      const expense = await getExpenseById(id);
      if (!expense)
        return Response.json({ error: "Expense not found" }, { status: 404 });
      return Response.json(expense);
    }

    if (req.method === "POST" && url.pathname === "/api/expenses") {
      const body = await req.json();
      const expense = await createExpense({ ...body });
      return Response.json(expense, { status: 201 });
    }

    if (req.method === "PUT" && /^\/api\/expenses\/\d+$/.test(url.pathname)) {
      const id = parseInt(url.pathname.split("/").pop()!);
      const body = await req.json();
      const expense = await updateExpense(id, body);
      if (!expense)
        return Response.json({ error: "Expense not found" }, { status: 404 });
      return Response.json(expense);
    }

    if (
      req.method === "DELETE" &&
      /^\/api\/expenses\/\d+$/.test(url.pathname)
    ) {
      const id = parseInt(url.pathname.split("/").pop()!);
      const success = await deleteExpense(id);
      if (!success)
        return Response.json({ error: "Expense not found" }, { status: 404 });
      return new Response(null, { status: 204 });
    }

    return new Response("Not Found", { status: 404 });
  } catch (err) {
    console.error("API Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
