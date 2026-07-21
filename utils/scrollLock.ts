/**
 * @file scrollLock.ts
 * @description 基于引用计数的 body 滚动锁定工具
 * @author gouxinjie
 * @created 2026-07-21
 * @updated 2026-07-21
 */

// 当前处于锁定状态的浮层数量（弹窗、灯箱等）
let lockCount = 0;
// 锁定前记录的 body 右侧内边距，解锁时还原
let prevPaddingRight = "";

/**
 * 锁定 body 滚动
 * 使用引用计数，多个浮层叠加时只有全部解锁后才真正恢复滚动，
 * 避免上层浮层关闭时误解锁下层浮层导致的背景滚动。
 * @returns void
 */
export const lockBodyScroll = (): void => {
  lockCount += 1;
  // 已经有浮层锁定，无需重复设置
  if (lockCount > 1) return;

  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  prevPaddingRight = document.body.style.paddingRight;
  document.body.style.overflow = "hidden";
  // 以滚动条等宽 padding 补偿，避免页面宽度抖动
  if (scrollBarWidth > 0) {
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  }
};

/**
 * 解锁 body 滚动
 * 与 lockBodyScroll 配对，仅在引用计数归零时真正恢复滚动。
 * @returns void
 */
export const unlockBodyScroll = (): void => {
  if (lockCount === 0) return;
  lockCount -= 1;
  // 仍有浮层处于锁定状态，暂不解锁
  if (lockCount > 0) return;

  document.body.style.overflow = "";
  document.body.style.paddingRight = prevPaddingRight;
};
