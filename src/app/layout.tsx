import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { APP_ORIGIN, APP_THEME_STORAGE_KEY, BRAND_NAME, CLARITY_PROJECT_ID, GA_MEASUREMENT_ID } from "@/config/app-config";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(APP_ORIGIN),
  title: {
    default: `Plynk | The Ultimate Bio-Link & Identity Hub for Creators`,
    template: `%s | Plynk`,
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
    siteName: "Plynk",
    title: "Plynk | The Ultimate Personal Link Hub",
    description: "One link, infinite potential. Build your artistic bio-link hub with premium widgets and art-first layouts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Plynk Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plynk | Your Personal Identity Hub",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Plynk",
    "url": APP_ORIGIN,
    "alternateName": ["Plynk Hub", "Plynk.in"]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}

        {/* Microsoft Clarity */}
        {CLARITY_PROJECT_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `}
          </Script>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
