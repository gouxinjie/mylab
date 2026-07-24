import { unstable_setRequestLocale } from "next-intl/server";
import styles from "./layout.module.scss";

/**
 * AILayout
 * @description AI 相关布局：仅提供容器与内容区，侧边栏由文章详情页自行渲染
 * @author gouxinjie
 * @created 2026-07-15
 * @updated 2026-07-16
 */

export default async function AILayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  unstable_setRequestLocale(locale);

  return (
    <div className={styles.wrapper}>
      <div className={`container-custom ${styles.content}`}>{children}</div>
    </div>
  );
}
