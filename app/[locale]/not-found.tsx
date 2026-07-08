import { Link } from "@/lib/navigation";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.visual}>
        <span className={styles.visual__bg}>
          404
        </span>
        <div className={styles.visual__content}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.visual__icon}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
      </div>
      
      <h1 className={styles.title}>页面走丢了</h1>
      <p className={styles.desc}>
        抱歉，您访问的页面不存在或已被移除。您可以尝试返回首页或通过导航栏寻找您需要的内容。
      </p>
      
      <div className={styles.actions}>
        <Link href="/" className="btn-primary">
          返回首页
        </Link>
        <Link href="/projects" className="btn-outline">
          查看项目
        </Link>
      </div>
    </div>
  );
}
