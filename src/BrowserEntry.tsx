import { hydrateRoot } from "react-dom/client";
import App from "./App";
import CreateExpense from "@/CreateExpense";

declare global {
  interface Window {
    __PATH__?: string;
  }
}

const path = window.__PATH__;
let Page = <App />;

if (path === "/create") {
  Page = <CreateExpense />;
}

hydrateRoot(document.getElementById("root")!, Page);
