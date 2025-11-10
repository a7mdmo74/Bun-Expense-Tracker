import { renderToString } from "react-dom/server";
import Main from "@/src/Main";
import App from "@/src/Pages/Home";
import CreateEditExpense from "@/src/Pages/CreateEditExpense";
import LoginPage from "@/src/Pages/Login";
import { getExpenseById } from "../db/expense";
import SignupPage from "@/src/Pages/Signup";

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

  if (url.pathname === "/login") {
    const html = renderToString(
      <Main path={url.pathname} children={<LoginPage />} />
    );
    return new Response("<!DOCTYPE html>" + html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (url.pathname === "/signup") {
    const html = renderToString(
      <Main path={url.pathname} children={<SignupPage />} />
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
  }

  return null;
}
