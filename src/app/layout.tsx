import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { APP_ORIGIN, APP_THEME_STORAGE_KEY, BRAND_NAME } from "@/config/app-config";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(APP_ORIGIN),
  title: {
    default: `${BRAND_NAME} | Your Personal Link Hub`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: "Create a beautiful, personalized link hub with widgets to showcase your digital identity. All in one place, all for you.",
  keywords: ["Link Hub", "Bio Link", "Portfolio", "Personal Site", "Widgets", "Plynk"],
  authors: [{ name: "shubham" }],
  creator: "shubham",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_ORIGIN,
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} | Your Personal Link Hub`,
    description: "Build Your Personal Link Hub With Widgets. Show the world who you are with a single link.",
    images: [
      {
        url: "/full-logo.png",
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Your Personal Link Hub`,
    description: "Build Your Personal Link Hub With Widgets. Show the world who you are with a single link.",
    images: ["/full-logo.png"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
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
