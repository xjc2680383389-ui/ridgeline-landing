/** 三位一分组，用窄空格分隔：技术图纸里的数字写法 */
export const formatGrouped = (value: number, decimals = 0) => {
  const fixed = Math.abs(value).toFixed(decimals);
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
  const sign = value < 0 ? '-' : '';
  return frac ? `${sign}${grouped}.${frac}` : `${sign}${grouped}`;
};

/** 2026-09-08 16:14 —— 回执与报告统一用补零格式 */
export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** 预订编号：RL-2609-4F7K —— 年前两位 + 月份 + 4 位随机 */
export const makeReference = (date = new Date()) => {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let tail = '';
  for (let i = 0; i < 4; i += 1) {
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    tail += alphabet[bytes[0] % alphabet.length];
  }
  return `RL-${yy}${mm}-${tail}`;
};
