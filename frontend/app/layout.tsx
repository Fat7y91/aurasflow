export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ background: '#fff', color: '#111', fontFamily: 'system-ui, Arial' }}>
        {children}
      </body>
    </html>
  );
}
