// Animated wrapper components for easy use
"use client";

import React from "react";
import {
  useFadeIn,
  useSlideIn,
  useStaggerChildren,
  useScaleIn,
} from "@/hooks/use-scroll-animations";

interface AnimatedProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className }: AnimatedProps) {
  const ref = useFadeIn(delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function SlideInLeft({ children, delay = 0, className }: AnimatedProps) {
  const ref = useSlideIn("left", delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function SlideInRight({
  children,
  delay = 0,
  className,
}: AnimatedProps) {
  const ref = useSlideIn("right", delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function SlideInUp({ children, delay = 0, className }: AnimatedProps) {
  const ref = useSlideIn("left", delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerChildren({
  children,
  delay = 0.1,
  className,
}: AnimatedProps & { delay?: number }) {
  const ref = useStaggerChildren(delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function ScaleIn({ children, delay = 0, className }: AnimatedProps) {
  const ref = useScaleIn(delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
