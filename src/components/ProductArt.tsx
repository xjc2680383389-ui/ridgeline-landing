import type { ArtKey } from '../data/catalog';

interface Props {
  art: ArtKey;
  /** 用于给 pattern id 加后缀，避免同页多份 SVG 的 id 冲突 */
  uid: string;
  className?: string;
}

const LINE = '#1a201e';

/**
 * 五款装备的制图式线稿：几何轮廓 + 压胶/缝线/尺寸标注，
 * 呼应“实测数据”的品牌语言，不依赖任何位图资源。
 */
export function ProductArt({ art, uid, className }: Props) {
  const weave = `${uid}-weave`;
  const grid = `${uid}-grid`;

  return (
    <svg
      className={className}
      viewBox="0 0 300 300"
      role="img"
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <pattern id={weave} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0H6" stroke="#4e6151" strokeWidth="0.6" opacity="0.32" />
        </pattern>
        <pattern id={grid} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0V10M0 10H10" stroke="#7a96a6" strokeWidth="0.5" opacity="0.4" />
        </pattern>
      </defs>

      {art === 'shell' && <Shell weave={weave} />}
      {art === 'pack' && <Pack weave={weave} />}
      {art === 'pant' && <Pant grid={grid} />}
      {art === 'fleece' && <Fleece grid={grid} />}
      {art === 'mitt' && <Mitt weave={weave} />}
    </svg>
  );
}

/* 尺寸标注：技术图纸的收边语言 */
function Dimension({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  return (
    <g stroke={LINE} strokeWidth="0.9" opacity="0.5">
      <path d={`M${x} ${y1}V${y2}`} />
      <path d={`M${x - 4} ${y1}H${x + 4}`} />
      <path d={`M${x - 4} ${y2}H${x + 4}`} />
      <text
        x={x - 8}
        y={(y1 + y2) / 2}
        fill={LINE}
        stroke="none"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="9"
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 ${x - 8} ${(y1 + y2) / 2})`}
      >
        {label}
      </text>
    </g>
  );
}

function Shell({ weave }: { weave: string }) {
  return (
    <g>
      {/* 风帽 */}
      <path
        d="M118 70Q150 26 182 70L172 76Q150 46 128 76Z"
        fill="#4e6151"
        stroke={LINE}
        strokeWidth="2.2"
      />
      {/* 衣身 + 袖 */}
      <path
        d="M128 70L100 78 72 140 92 148 106 120 104 226 196 226 194 120 208 148 228 140 200 78 172 70Q150 86 128 70Z"
        fill="#f4f5f0"
        stroke={LINE}
        strokeWidth="2.4"
      />
      <path
        d="M128 70L100 78 72 140 92 148 106 120 104 226 196 226 194 120 208 148 228 140 200 78 172 70Q150 86 128 70Z"
        fill={`url(#${weave})`}
        stroke="none"
      />
      {/* 主拉链与压胶条 */}
      <path d="M150 82V226" stroke={LINE} strokeWidth="2" />
      <path d="M145 82V226" stroke="#7a96a6" strokeWidth="3.4" opacity="0.55" />
      <path d="M150 96h9" stroke="#ee5a1c" strokeWidth="3.2" />
      {/* 胸袋 / 手袋 */}
      <path d="M116 118h26M158 118h26" stroke={LINE} strokeWidth="1.6" />
      <path d="M112 176l20-6M188 176l-20-6" stroke={LINE} strokeWidth="1.6" />
      {/* 接缝压胶（13 mm 宽） */}
      <path d="M106 122 104 226M194 122 196 226" stroke="#7a96a6" strokeWidth="3" opacity="0.5" strokeDasharray="7 5" />
      <path d="M100 78 128 70M200 78 172 70" stroke="#7a96a6" strokeWidth="3" opacity="0.5" />
      {/* 袖口 */}
      <path d="M72 140l20 8M228 140l-20 8" stroke={LINE} strokeWidth="2.2" />
      <rect x="68" y="134" width="12" height="18" rx="2" fill="#28382f" stroke={LINE} strokeWidth="1.6" transform="rotate(-22 74 143)" />
      <Dimension x={54} y1={78} y2={226} label="724 mm" />
    </g>
  );
}

function Pack({ weave }: { weave: string }) {
  return (
    <g>
      {/* 背板与肩带 */}
      <path d="M112 84C92 130 92 190 108 232" stroke={LINE} strokeWidth="2.2" />
      <path d="M188 84C208 130 208 190 192 232" stroke={LINE} strokeWidth="2.2" />
      {/* 包体 */}
      <rect x="86" y="82" width="128" height="158" rx="9" fill="#f4f5f0" stroke={LINE} strokeWidth="2.4" />
      <rect x="86" y="82" width="128" height="158" rx="9" fill={`url(#${weave})`} stroke="none" />
      {/* 卷口 */}
      <rect x="80" y="56" width="140" height="30" rx="6" fill="#4e6151" stroke={LINE} strokeWidth="2.2" />
      <path d="M80 71h140" stroke="#dcdDD6" strokeWidth="1.2" opacity="0.6" />
      {/* 三道扣具带 */}
      {[104, 150, 196].map((x) => (
        <g key={x}>
          <path d={`M${x} 62v50`} stroke={LINE} strokeWidth="2" />
          <rect x={x - 8} y="58" width="16" height="14" rx="2" fill="#ee5a1c" stroke={LINE} strokeWidth="1.6" />
        </g>
      ))}
      {/* 前袋 + 防水拉链 */}
      <rect x="104" y="150" width="92" height="62" rx="6" fill="#e9ebe4" stroke={LINE} strokeWidth="2" />
      <path d="M104 164h92" stroke={LINE} strokeWidth="1.6" strokeDasharray="5 4" />
      <path d="M112 172h34" stroke="#7a96a6" strokeWidth="3.6" opacity="0.7" />
      <circle cx="146" cy="172" r="3.6" fill="#ee5a1c" stroke={LINE} strokeWidth="1.4" />
      {/* 侧压缩带 */}
      <path d="M86 118h20M86 200h20" stroke={LINE} strokeWidth="2" />
      <rect x="98" y="112" width="10" height="12" rx="2" fill="#28382f" stroke={LINE} strokeWidth="1.4" />
      <rect x="98" y="194" width="10" height="12" rx="2" fill="#28382f" stroke={LINE} strokeWidth="1.4" />
      {/* 底部加固 */}
      <path d="M86 222h128" stroke={LINE} strokeWidth="2" />
      <path d="M120 240v12M180 240v12" stroke={LINE} strokeWidth="1.8" />
      <Dimension x={240} y1={56} y2={240} label={'45 L'} />
    </g>
  );
}

function Pant({ grid }: { grid: string }) {
  return (
    <g>
      {/* 腰头 */}
      <rect x="104" y="58" width="92" height="20" rx="2" fill="#4e6151" stroke={LINE} strokeWidth="2.2" />
      {[118, 150, 182].map((x) => (
        <rect key={x} x={x - 4} y="60" width="8" height="16" rx="1.5" fill="#f4f5f0" stroke={LINE} strokeWidth="1.4" />
      ))}
      {/* 裤身 */}
      <path
        d="M104 78h92l10 168h-40l-16-92-16 92h-40Z"
        fill="#f4f5f0"
        stroke={LINE}
        strokeWidth="2.4"
      />
      <path d="M104 78h92l10 168h-40l-16-92-16 92h-40Z" fill={`url(#${grid})`} stroke="none" />
      {/* 门襟 */}
      <path d="M150 78v34" stroke={LINE} strokeWidth="1.8" />
      <path d="M143 82v28" stroke="#7a96a6" strokeWidth="2.6" opacity="0.6" />
      {/* 膝部预弯 */}
      <path d="M108 158h24M168 158h24" stroke={LINE} strokeWidth="1.8" strokeDasharray="4 4" />
      <path d="M107 172h24M169 172h24" stroke={LINE} strokeWidth="1.8" strokeDasharray="4 4" />
      {/* 大腿工装袋 */}
      <rect x="176" y="108" width="26" height="34" rx="3" fill="#e9ebe4" stroke={LINE} strokeWidth="1.9" />
      <path d="M176 118h26" stroke={LINE} strokeWidth="1.5" />
      <path d="M184 113h10" stroke="#ee5a1c" strokeWidth="2.6" />
      {/* 裆部三角接片 */}
      <path d="M136 154l14-24 14 24" stroke={LINE} strokeWidth="1.6" opacity="0.75" />
      {/* 裤脚 */}
      <path d="M100 234h36M164 234h36" stroke={LINE} strokeWidth="1.8" />
      <Dimension x={64} y1={58} y2={246} label="1 042 mm" />
    </g>
  );
}

function Fleece({ grid }: { grid: string }) {
  return (
    <g>
      {/* 立领 */}
      <path d="M126 78Q150 56 174 78L170 90Q150 74 130 90Z" fill="#4e6151" stroke={LINE} strokeWidth="2.2" />
      {/* 衣身与插肩袖 */}
      <path
        d="M128 82L100 90 72 150 92 158 106 130 104 214 196 214 194 130 208 158 228 150 200 90 172 82Q150 98 128 82Z"
        fill="#f4f5f0"
        stroke={LINE}
        strokeWidth="2.4"
      />
      <path
        d="M128 82L100 90 72 150 92 158 106 130 104 214 196 214 194 130 208 158 228 150 200 90 172 82Q150 98 128 82Z"
        fill={`url(#${grid})`}
        stroke="none"
      />
      {/* 半开拉链 */}
      <path d="M150 92v62" stroke={LINE} strokeWidth="2.2" />
      <path d="M150 100v48" stroke="#ee5a1c" strokeWidth="2.8" />
      {/* 插肩缝 */}
      <path d="M128 84 106 130M172 84 194 130" stroke={LINE} strokeWidth="1.4" strokeDasharray="5 4" />
      {/* 袋鼠兜 */}
      <path d="M110 172h80v30h-80z" fill="#e9ebe4" stroke={LINE} strokeWidth="1.9" />
      <path d="M110 172h80" stroke={LINE} strokeWidth="1.9" />
      {/* 拇指扣袖口 */}
      <rect x="64" y="144" width="14" height="20" rx="3" fill="#28382f" stroke={LINE} strokeWidth="1.6" transform="rotate(-28 71 154)" />
      <rect x="222" y="144" width="14" height="20" rx="3" fill="#28382f" stroke={LINE} strokeWidth="1.6" transform="rotate(28 229 154)" />
      {/* 下摆 */}
      <path d="M104 204h92" stroke={LINE} strokeWidth="1.6" opacity="0.7" />
      <Dimension x={52} y1={56} y2={214} label="640 mm" />
    </g>
  );
}

function Mitt({ weave }: { weave: string }) {
  return (
    <g>
      {/* 掌体 */}
      <path
        d="M112 200L110 140Q110 100 150 94Q192 90 198 134L202 200Z"
        fill="#f4f5f0"
        stroke={LINE}
        strokeWidth="2.4"
      />
      <path
        d="M112 200L110 140Q110 100 150 94Q192 90 198 134L202 200Z"
        fill={`url(#${weave})`}
        stroke="none"
      />
      {/* 拇指 */}
      <path d="M111 148Q88 152 87 173Q87 195 112 194Z" fill="#e9ebe4" stroke={LINE} strokeWidth="2.2" />
      {/* 掌面山羊革贴片 */}
      <path d="M124 150Q152 138 182 152L186 192Q152 202 124 192Z" fill="#b9b49c" stroke={LINE} strokeWidth="1.9" />
      <path d="M128 156Q152 146 178 158" stroke={LINE} strokeWidth="1.3" strokeDasharray="4 4" />
      {/* 指根车线 */}
      <path d="M118 124Q152 112 190 126" stroke={LINE} strokeWidth="1.5" strokeDasharray="5 4" />
      {/* 加长腕口 */}
      <rect x="104" y="196" width="102" height="56" rx="5" fill="#28382f" stroke={LINE} strokeWidth="2.3" />
      <rect x="104" y="208" width="102" height="10" fill="#ee5a1c" />
      <path d="M104 232h102" stroke="#dcdDD6" strokeWidth="1.2" opacity="0.5" />
      {/* 束绳与扣件 */}
      <circle cx="212" cy="244" r="6.5" fill="#f4f5f0" stroke={LINE} strokeWidth="1.8" />
      <path d="M218 244q16 6 20 22" stroke={LINE} strokeWidth="1.6" />
      <Dimension x={62} y1={94} y2={252} label="318 mm" />
    </g>
  );
}
