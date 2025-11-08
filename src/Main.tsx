import { ToastContainer } from "react-toastify";

export default function Main({
  children,
  path,
  expense,
}: {
  children: React.ReactNode;
  path?: string;
  expense?: any;
}) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Expense Tracker</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/react-toastify@10/dist/ReactToastify.css"
        />
        <link href="/assets/tailwind.css" rel="stylesheet" />
      </head>
      <body>
        <div id="root">
          {children}
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
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__PATH__ = ${JSON.stringify(path || "/")};
              window.__EXPENSE__ = ${JSON.stringify(expense || null)};
            `,
          }}
        />
        <script src="/index.js" type="module"></script>
      </body>
    </html>
  );
}
