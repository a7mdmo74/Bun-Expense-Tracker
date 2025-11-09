import React from "react";
import { renderToString } from "react-dom/server";
import { serveStatic } from "./middleware/static";
import { logger } from "./middleware/logger";

import {
  createExpense,
  deleteExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
} from "./db";
import Main from "@/src/Main";
import App from "@/src/App";
import CreateEditExpense from "@/src/CreateEditExpense";
Bun.serve({
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
    if (url.pathname === "/") {
      const html = renderToString(<Main children={<App />} />);
      const response = new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
      logger(req, startTime, response);
      return response;
    } else if (url.pathname === "/create") {
      const html = renderToString(
        <Main path={url.pathname} children={<CreateEditExpense />} />
      );
      return new Response("<!DOCTYPE html>" + html, {
        headers: { "Content-Type": "text/html" },
      });
    } else if (url.pathname.startsWith("/edit/")) {
      const id = parseInt(url.pathname.split("/")[2]!);
      const expense = await getExpenseById(id);
      if (!expense) {
        const response = new Response("Expense not found", { status: 404 });
        logger(req, startTime, response);
        return response;
      }
      const html = renderToString(
        <Main
          path={url.pathname}
          expense={expense}
          children={<CreateEditExpense expense={expense} />}
        />
      );
      const response = new Response("<!DOCTYPE html>" + html, {
        headers: { "Content-Type": "text/html" },
      });
      logger(req, startTime, response);
      return response;
    }
    if (url.pathname.startsWith("/api/expenses")) {
      try {
        if (req.method === "GET" && url.pathname === "/api/expenses") {
          const expenses = await getExpenses();
          return Response.json(expenses);
        }
        if (
          req.method === "GET" &&
          /^\/api\/expenses\/\d+$/.test(url.pathname)
        ) {
          const id = parseInt(url.pathname.split("/").pop()!);
          const expense = await getExpenseById(id);
          if (!expense)
            return Response.json(
              { error: "Expense not found" },
              { status: 404 }
            );
          return Response.json(expense);
        }
        if (req.method === "POST" && url.pathname === "/api/expenses") {
          const body = await req.json();
          const expense = await createExpense({ ...body, user_id: 1 });
          return Response.json(expense, { status: 201 });
        }
        if (
          req.method === "PUT" &&
          /^\/api\/expenses\/\d+$/.test(url.pathname)
        ) {
          const id = parseInt(url.pathname.split("/").pop()!);
          const body = await req.json();
          const expense = await updateExpense(id, body);
          if (!expense)
            return Response.json(
              { error: "Expense not found" },
              { status: 404 }
            );
          return Response.json(expense);
        }
        if (
          req.method === "DELETE" &&
          /^\/api\/expenses\/\d+$/.test(url.pathname)
        ) {
          const id = parseInt(url.pathname.split("/").pop()!);
          const success = await deleteExpense(id);
          if (!success)
            return Response.json(
              { error: "Expense not found" },
              { status: 404 }
            );
          return new Response(null, { status: 204 });
        }
      } catch (err) {
        console.error("API Error:", err);
        return Response.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    }
    const response = new Response("Page not found", { status: 404 });
    logger(req, startTime, response);
    return response;
  },
});
console.log("Server running on http://localhost:3000");
