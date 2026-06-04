"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

interface ScrollRevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({
  as: Component = "div",
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -5% 0px",
        threshold: 0.06,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined =
    delay > 0 ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <Component
      ref={ref}
      className={`scroll-reveal${visible ? " scroll-reveal_visible" : ""}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </Component>
  );
}
