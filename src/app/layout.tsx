import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { APP_THEME_STORAGE_KEY, BRAND_NAME } from "@/config/app-config";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND_NAME} | Your Personal Link Hub`,
  description: "Build Your Personal Link Hub With Widgets",
  icons: {
    icon: "/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('${APP_THEME_STORAGE_KEY}');
                var theme = stored === 'light' ? 'light' : 'dark';
                localStorage.setItem('${APP_THEME_STORAGE_KEY}', theme);
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <GlobalBackground />
        <Providers>
          <Toaster richColors position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
