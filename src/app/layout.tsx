import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { APP_ORIGIN, APP_THEME_STORAGE_KEY, BRAND_NAME } from "@/config/app-config";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(APP_ORIGIN),
  title: {
    default: `${BRAND_NAME} | The Ultimate Bio-Link & Identity Hub for Creators`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: "Transform your online presence with Plynk. Create a stunning, high-converting bio-link hub with interactive widgets, social feeds, and artistic layouts. Perfect for creators, developers, and artists.",
  keywords: [
    "Bio Link", 
    "Link in Bio", 
    "Linktree alternative", 
    "Creator Portfolio", 
    "Digital Identity", 
    "Personal Website Builder", 
    "Widget Link Hub", 
    "Plynk", 
    "Developer Portfolio Link",
    "Animated Link Hub"
  ],
  authors: [{ name: "plynk team" }],
  creator: "plynk",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_ORIGIN,
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} | The Ultimate Personal Link Hub`,
    description: "One link, infinite potential. Build your artistic bio-link hub with premium widgets and art-first layouts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} Platform Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Your Personal Identity Hub`,
    description: "Showcase your whole world with one link. Interactive, widget-based, and art-first.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
