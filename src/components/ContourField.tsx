import { useMemo, type CSSProperties } from 'react';

const LEVELS = 13;
const W = 1200;
const H = 760;
const STEP = 30;

/**
 * 等高线场。线本身不是装饰：它按固定步长生成一条山脊剖面，
 * 入场时用 pathLength 归一化描边一次性画出。
 */
export function ContourField() {
  const paths = useMemo(() => {
    const out: { d: string; index: number }[] = [];
    for (let k = 0; k < LEVELS; k += 1) {
      let d = '';
      for (let x = 0; x <= W; x += STEP) {
        const t = x / W;
        const y =
          96 +
          k * 52 +
          44 * Math.sin(t * Math.PI * 2 * 1.35 + k * 0.5) +
          20 * Math.sin(t * Math.PI * 2 * 3.2 + k * 1.15) +
          9 * Math.sin(t * Math.PI * 2 * 7.1 + k * 0.3);
        d += `${x === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      out.push({ d, index: k });
    }
    return out;
  }, []);

  return (
    <svg
      className="contours"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map(({ d, index }) => {
        const ridge = index === 6;
        return (
          <path
            key={index}
            d={d}
            pathLength={1}
            className="contours__line"
            stroke={ridge ? 'var(--glacier)' : 'var(--moss)'}
            strokeWidth={ridge ? 1.8 : 1}
            opacity={ridge ? 0.85 : 0.42}
            style={
              {
                '--dash': 1,
                animationDelay: `${140 + index * 55}ms`,
              } as CSSProperties
            }
          />
        );
      })}
    </svg>
  );
}
