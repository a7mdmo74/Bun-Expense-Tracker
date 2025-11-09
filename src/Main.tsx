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
        <link rel="icon" href="/favicon.ico" />

        <link href="/assets/tailwind.css" rel="stylesheet" />
      </head>
      <body>
        <div id="root">{children}</div>

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
