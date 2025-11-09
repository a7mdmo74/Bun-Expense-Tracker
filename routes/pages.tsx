import { renderToString } from "react-dom/server";
import Main from "@/src/Main";
import App from "@/src/App";
import CreateEditExpense from "@/src/CreateEditExpense";
import { getExpenseById } from "../db";

export async function handlePageRoutes(url: URL) {
  if (url.pathname === "/") {
    const html = renderToString(<Main children={<App />} />);
    return new Response("<!DOCTYPE html>" + html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (url.pathname === "/create") {
    const html = renderToString(
      <Main path={url.pathname} children={<CreateEditExpense />} />
    );
    return new Response("<!DOCTYPE html>" + html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (url.pathname.startsWith("/edit/")) {
    const id = parseInt(url.pathname.split("/")[2]!);
    const expense = await getExpenseById(id);
    if (!expense) {
      return new Response("Expense not found", { status: 404 });
    }
    const html = renderToString(
      <Main
        path={url.pathname}
        expense={expense}
        children={<CreateEditExpense expense={expense} />}
      />
    );
    return new Response("<!DOCTYPE html>" + html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  return null;
}
