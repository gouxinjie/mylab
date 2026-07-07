import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/components/AppProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "xinjie - Full Stack Developer & AI Explorer",
    template: "%s | xinjie",
  },
  description:
    "全栈开发者，AI 探索者。用代码构建价值，用 AI 探索未来。Full Stack Developer, AI Explorer. Building value with code, exploring the future with AI.",
  keywords: [
    "xinjie",
    "全栈开发",
    "前端",
    "后端",
    "AI",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
  ],
  authors: [{ name: "xinjie", url: "https://gouxinjie.com" }],
  creator: "xinjie",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: "https://gouxinjie.com",
    siteName: "xinjie",
    title: "xinjie - Full Stack Developer & AI Explorer",
    description:
      "全栈开发者，AI 探索者。用代码构建价值，用 AI 探索未来。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "xinjie Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "xinjie - Full Stack Developer & AI Explorer",
    description:
      "全栈开发者，AI 探索者。用代码构建价值，用 AI 探索未来。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "xinjie",
              url: "https://gouxinjie.com",
              jobTitle: "Full Stack Developer & AI Explorer",
              sameAs: [
                "https://github.com/gouxinjie",
                "https://twitter.com/gouxinjie",
                "https://linkedin.com/in/gouxinjie",
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <AppProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
