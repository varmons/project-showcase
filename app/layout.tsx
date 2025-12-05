import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { cn } from "@/lib/utils";
import { SiteLayout } from "@/components/layout/site-layout";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono"
});

export const metadata: Metadata = {
  title: "Project Showcase | Portfolio",
  description: "Product Manager & Frontend Architect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(spaceMono.variable, "min-h-screen bg-background font-mono antialiased selection:bg-primary selection:text-primary-foreground")}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SiteLayout>
              {children}
            </SiteLayout>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

