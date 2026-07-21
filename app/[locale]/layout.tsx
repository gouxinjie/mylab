import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/styles/global.scss";
import { AppProvider } from "@/components/commons/AppProviders";
import Navbar from "@/components/commons/Navbar";
import Footer from "@/components/commons/Footer";
import PageTransition from "@/components/commons/PageTransition";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { notFound } from 'next/navigation';

// Inter 字体自托管：从本地 woff2 加载，避免编译期访问 Google Fonts 失败
const inter = localFont({
  src: [
    { path: "../fonts/inter/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter/inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

// JetBrains Mono 等宽字体自托管：本地 woff2，避免构建期访问 Google Fonts 失败
const jetbrainsMono = localFont({
  src: [
    { path: "../fonts/jetbrains-mono/JetBrainsMono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/jetbrains-mono/JetBrainsMono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Noto Sans SC 中文字体自托管：本地 woff2 简体子集，preload:false 避免大字库阻塞首屏
const notoSansSC = localFont({
  src: [
    { path: "../fonts/noto-sans-sc/noto-sc-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/noto-sans-sc/noto-sc-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/noto-sans-sc/noto-sc-700.woff2", weight: "700", style: "normal" },
  ],
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
    default: "xinjie | web开发",
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
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  // 启用全面屏安全区，使 env(safe-area-inset-*) 生效，避免页脚被底部工具栏遮挡
  viewportFit: "cover",
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

  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  setRequestLocale(locale);

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
