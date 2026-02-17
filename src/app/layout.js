import "./globals.css";
import { SupabaseProvider } from "../context/SupabaseProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}