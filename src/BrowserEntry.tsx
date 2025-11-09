import { hydrateRoot } from "react-dom/client";
import App from "./App";
import type { Expense } from "schema/validations";
import CreateEditExpense from "@/src/CreateEditExpense";
import { Toaster } from "@/src/components/ui/sonner";

declare global {
  interface Window {
    __PATH__?: string;
    __EXPENSE__?: Expense;
  }
}

const path = window.__PATH__ || "/";
const expense = window.__EXPENSE__;
let Page = <App />;

if (path === "/create") {
  Page = <CreateEditExpense />;
} else if (path.startsWith("/edit/")) {
  Page = <CreateEditExpense expense={expense} />;
}

hydrateRoot(
  document.getElementById("root")!,
  <>
    {Page}
    <Toaster position="top-center" />
  </>
);
