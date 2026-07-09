import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import "@/styles/global.scss";
import { AppProvider } from "@/components/commons/AppProviders";
import Navbar from "@/components/commons/Navbar";
import Footer from "@/components/commons/Footer";
import PageTransition from "@/components/commons/PageTransition";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { notFound } from 'next/navigation';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
  preload: false,
});

/**
 * RootLayout
 * @description 根布局组件，集成 i18n、主题、导航和动画
 * @author gouxinjie
 */

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // 验证 locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 获取翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansSC.variable}`}>
      <head>
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
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProvider>
            {/* 顶部导航栏 */}
            <Navbar />
            <main>
              <PageTransition>{children}</PageTransition>
            </main>
            {/* 页脚 */}
            <Footer />
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
