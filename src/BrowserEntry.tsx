import { hydrateRoot } from "react-dom/client";
import type { Expense } from "schema/validations";
import CreateEditExpense from "@/src/Pages/CreateEditExpense";
import LoginPage from "@/src/Pages/Login";
import SignupPage from "@/src/Pages/Signup";
import Home from "@/src/Pages/Home";

declare global {
  interface Window {
    __PATH__?: string;
    __EXPENSE__?: Expense;
  }
}

const path = window.__PATH__ || "/";
const expense = window.__EXPENSE__;
let Page = <Home />;

if (path === "/create") {
  Page = <CreateEditExpense />;
} else if (path.startsWith("/edit/")) {
  Page = <CreateEditExpense expense={expense} />;
} else if (path.startsWith("/login")) {
  Page = <LoginPage />;
} else if (path.startsWith("/signup")) {
  Page = <SignupPage />;
}

hydrateRoot(document.getElementById("root")!, <>{Page}</>);
