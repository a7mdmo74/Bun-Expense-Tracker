import { hydrateRoot } from "react-dom/client";
import App from "./Pages/Home";
import CreateEditExpense from "@/src/Pages/CreateEditExpense";

declare global {
  interface Window {
    __PATH__?: string;
  }
}

const path = window.__PATH__ || "/";
let Page = <App />;

if (path === "/create") {
  Page = <CreateEditExpense />;
} else if (path.startsWith("/edit/")) {
  Page = <CreateEditExpense />;
}

hydrateRoot(document.getElementById("root")!, <>{Page}</>);
