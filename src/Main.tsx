import { useEffect, useState } from "react";

export default function Main({
  children,
  path,
}: {
  children: React.ReactNode;
  path?: string;
}) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Expense Tracker</title>
        <link href="/assets/tailwind.css" rel="stylesheet" />
      </head>
      <body>
        <div id="root">{children}</div>

        {/* 👇 inject current path for hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__PATH__ = ${JSON.stringify(path || "/")};`,
          }}
        />
        <script src="/index.js" type="module"></script>
      </body>
    </html>
  );
}
