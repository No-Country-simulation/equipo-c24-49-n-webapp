
export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Panal - Gestor de Tareas</title>
        <meta name="description" content="Gestor de Tareas Colaborativo" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body>
        {children}
      </body>
    </html>
  );
}