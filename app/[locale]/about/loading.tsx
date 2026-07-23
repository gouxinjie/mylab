/**
 * @file loading.tsx
 * @description About 路由级加载骨架屏，导航/数据加载期间展示，避免纯白屏
 * @author gouxinjie
 * @created 2026-07-23
 */

import styles from "./loading.module.scss";

export default function AboutLoading() {
  return (
    <div className="container-custom" style={{ maxWidth: 980 }}>
      {/* Hero 骨架 */}
      <div className={styles.hero}>
        <div className={`${styles.skeleton} ${styles.avatar}`} />
        <div className={`${styles.skeleton} ${styles.lineName}`} />
        <div className={`${styles.skeleton} ${styles.lineTag}`} />
        <div className={`${styles.skeleton} ${styles.lineDesc}`} />
        <div className={`${styles.skeleton} ${styles.lineDesc}`} />
      </div>

      {/* 数据概览骨架 */}
      <div className={styles.gap24} style={{ marginTop: 32 }}>
        <div className={`${styles.skeleton} ${styles.sectionTitle}`} />
        <div className={styles.statsGrid}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${styles.skeleton} ${styles.statCard}`} />
          ))}
        </div>
      </div>

      {/* GitHub 看板骨架 */}
      <div className={styles.gap24} style={{ marginTop: 32 }}>
        <div className={`${styles.skeleton} ${styles.sectionTitle}`} />
        <div className={styles.dashGrid}>
          <div className={`${styles.skeleton} ${styles.block}`} style={{ height: 220 }} />
          <div className={`${styles.skeleton} ${styles.block}`} style={{ height: 220 }} />
        </div>
      </div>

      {/* 技术清单骨架 */}
      <div className={styles.gap24} style={{ marginTop: 32 }}>
        <div className={`${styles.skeleton} ${styles.sectionTitle}`} />
        <div className={`${styles.skeleton} ${styles.block}`} style={{ height: 180 }} />
      </div>

      {/* 价值观骨架 */}
      <div className={styles.gap24} style={{ marginTop: 32 }}>
        <div className={`${styles.skeleton} ${styles.sectionTitle}`} />
        <div className={styles.valuesGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${styles.skeleton} ${styles.valueCard}`} style={{ height: 120 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
