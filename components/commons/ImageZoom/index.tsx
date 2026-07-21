/**
 * @component ImageZoom
 * @description 图片放大预览组件：缩略图点击后调用公共 Lightbox 按图片原始比例放大查看
 * @author gouxinjie
 * @created 2026-07-21
 * @updated 2026-07-21
 */

"use client";

import { useState, type CSSProperties } from "react";
import Lightbox from "@/components/commons/Lightbox";
import styles from "./index.module.scss";

/**
 * ImageZoom 组件属性
 */
interface ImageZoomProps {
  /** 图片地址 */
  src?: string;
  /** 图片替代文本 */
  alt?: string;
  /** 悬浮提示文本（已剔除尺寸指令） */
  title?: string;
  /** 缩略图内联样式（宽高等尺寸控制） */
  style?: CSSProperties;
}

/**
 * 图片放大预览组件（缩略图触发）
 * @param src - 图片地址
 * @param alt - 替代文本
 * @param title - 悬浮提示
 * @param style - 缩略图内联样式
 * @returns 支持点击放大的图片节点 + 公共 Lightbox
 */
export default function ImageZoom({ src, alt, title, style }: ImageZoomProps) {
  // 灯箱是否打开
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 缩略图包裹层：承载图片与"点击放大"提示 */}
      <span className={styles.thumbWrap}>
        {/* 缩略图：鼠标悬浮显示放大光标，点击打开灯箱 */}
        <img
          src={src}
          alt={alt}
          title={title}
          style={style}
          loading="lazy"
          className={styles.thumb}
          onClick={() => setOpen(true)}
        />
        {/* 触摸设备提示（CSS 控制在 coarse pointer 时显示） */}
        <span className={styles.thumbHint} aria-hidden>
          点击放大
        </span>
      </span>

      {/* 复用公共灯箱组件 */}
      <Lightbox
        open={open}
        src={src ?? ""}
        alt={alt}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
