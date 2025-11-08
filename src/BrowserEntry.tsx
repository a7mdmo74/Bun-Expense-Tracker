import { hydrateRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./App";
import CreateExpense from "@/CreateExpense";
import type { Expense } from "schema/validations";

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
  Page = <CreateExpense />;
} else if (path.startsWith("/edit/")) {
  Page = <CreateExpense expense={expense} />;
}

// Wrap with ToastContainer
hydrateRoot(
  document.getElementById("root")!,
  <>
    {Page}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </>
);
