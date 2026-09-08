import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useMotion';

interface Options {
  duration?: number;
  delay?: number;
  decimals?: number;
}

/**
 * 数值滚动。只在元素首次进入视口时运行一次，之后保持终值——
 * 实测数据不应该反复动。
 *
 * 兜底：若观察器迟迟没触发（不支持或被节流），直接显示终值。
 * 数字是页面上的事实，不能停在 0。
 */
export function useCountUp(target: number, options: Options = {}) {
  const { duration = 1400, delay = 0, decimals = 0 } = options;
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setValue(target);
      return;
    }

    let raf = 0;
    let timer = 0;
    let start: number | null = null;
    let running = false;

    const step = (now: number) => {
      running = true;
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = target * eased;
      setValue(decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timer = window.setTimeout(() => {
          raf = requestAnimationFrame(step);
        }, delay);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    const failsafe = window.setTimeout(() => {
      if (!running) setValue(target);
    }, delay + duration + 400);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.clearTimeout(failsafe);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay, decimals, reduced]);

  return { ref, value };
}
