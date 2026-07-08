"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * @component FadeIn
 * @description 元素渐入动画组件
 * @author gouxinjie
 * @created 2024
 * @updated 2024
 */
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  delayOffset?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  y = 24,
  delayOffset = 0.1,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const variants = {
    hidden: { opacity: 0, y: y, },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.6,
        delay,
        bounce: 0,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}
