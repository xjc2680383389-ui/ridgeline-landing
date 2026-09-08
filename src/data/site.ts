/* ======================= 导航 ======================= */
export const NAV = [
  { id: 'catalog', label: '装备' },
  { id: 'proof', label: '实测' },
  { id: 'story', label: '来路' },
  { id: 'preorder', label: '预订' },
] as const;

/* ======================= Hero 实测条 ======================= */
export interface Readout {
  label: string;
  value: number;
  unit: string;
  method: string;
  decimals: number;
}

/** 入场时各滚动一次，之后静止 */
export const READOUTS: Readout[] = [
  { label: '静水压', value: 28000, unit: 'mm', method: 'JIS L 1092 B', decimals: 0 },
  { label: '耐磨', value: 40000, unit: '循环', method: 'ISO 12947-2', decimals: 0 },
  { label: '整包承重', value: 22, unit: 'kg', method: 'GB/T 4980', decimals: 0 },
  { label: '低温作业', value: -25, unit: '°C', method: 'GB/T 5470', decimals: 0 },
];

/* ======================= 实测报告 ======================= */
export interface TestRow {
  id: string;
  item: string;
  method: string;
  requirement: string;
  result: string;
  /** 这项测试对使用者意味着什么 */
  why: string;
  detail: string;
}

export const TESTS: TestRow[] = [
  {
    id: 'hydrostatic',
    item: '静水压',
    method: 'JIS L 1092 B',
    requirement: '≥ 20 000 mm',
    result: '28 000 mm',
    why: '暴雨加背包肩带压迫时，水压会远超“淋雨”本身。低于 15 000 mm 的面料会在肩带上先渗。',
    detail:
      '试样 100 cm²，以 60 mm/min 速率递增水压，记录第三处渗水时的压力值。每批面料随机取 5 卷，取最差值而非平均值。',
  },
  {
    id: 'martindale',
    item: '耐磨',
    method: 'ISO 12947-2',
    requirement: '≥ 30 000 循环',
    result: '40 000 循环',
    why: '岩面摩擦、行李传送带、日常久坐的椅面，都在消耗同一块布。循环数决定它几年后开始变薄。',
    detail:
      '标准羊毛磨料，李莎根曲线轨迹，累计至两根纱线断裂。40 000 循环相当于约 5 年的常规徒步摩擦量。',
  },
  {
    id: 'seam',
    item: '接缝滑移',
    method: 'ISO 13935-2',
    requirement: '≥ 0.15 kN',
    result: '0.42 kN',
    why: '大多数装备不是被磨破的，是从缝线处开口的。接缝强度低于面料强度时，面料再厚也没意义。',
    detail: '5 cm 宽试样，25 mm/min 拉伸至接缝开线。全部产品线采用来密包缝 + 打枣加固双重工艺。',
  },
  {
    id: 'tear',
    item: '撕裂强力',
    method: 'ISO 4674-1',
    requirement: '≥ 300 g',
    result: '780 g',
    why: '被树枝、冰爪、车门挂住的瞬间，需要的是不继续撕开。这一项决定了你会不会在半山腰用胶带补衣服。',
    detail: '摆杆法，预切 16 mm 口。测试前试样在 20 °C / 65% RH 环境调湿 24 小时。',
  },
  {
    id: 'cold',
    item: '低温脆化',
    method: 'GB/T 5470',
    requirement: '-20 °C 无裂纹',
    result: '-35 °C 无裂纹',
    why: '涂层与压胶在低温下会变硬变脆。冬天开裂的防水膜，比不防水更危险，因为它会撕成大口子。',
    detail: '试样在目标温度冷冻 2 小时后，绕规定直径芯棒弯曲 180°，在 10 倍放大镜下观察裂纹。',
  },
  {
    id: 'salt',
    item: '五金盐雾',
    method: 'ASTM B117',
    requirement: '48 h 无锈蚀',
    result: '96 h 无锈蚀',
    why: '拉链头、扣具、D 环是最先失效的部件。海上与高湿环境里的盐分会在两周内咬穿普通电镀。',
    detail: '5% NaCl 连续喷雾。所有外露五金改为 316 不锈钢或阳极氧化铝合金，可提供备件。',
  },
  {
    id: 'breathability',
    item: '透湿',
    method: 'ISO 15496',
    requirement: '≥ 15 000 g/m²·24h',
    result: '25 000 g/m²·24h',
    why: '防雨外套如果不透湿，内部结露会让你以为它漏了。爬升时的排汗量远高于降雨带来的困扰。',
    detail: '倒杯法，35 °C / 65% RH，记录 24 小时透过 1 m² 面料的水汽量。',
  },
  {
    id: 'colour',
    item: '色牢度',
    method: 'ISO 105-X12',
    requirement: '≥ 3-4 级',
    result: '4-5 级',
    why: '汗渍与洗涤后的褪色会染到内层与背包。分级越高，越接近“洗三十次还是一个颜色”。',
    detail: '干/湿摩擦白布，5 次往复。同时执行 10 次标准洗涤后复测，色差 ΔE < 1.5。',
  },
];

/* ======================= 品牌故事 ======================= */
export interface Milestone {
  year: string;
  title: string;
  text: string;
}

export const STORY_TIMELINE: Milestone[] = [
  {
    year: '2011',
    title: '第一件产品被自己拆了',
    text: '第一款硬壳在贡嘎转山途中开线七处。我们把全部 480 件回收拆开的线头摊在桌上，做成了一本报废图册——那是脊线最早的标准文件。',
  },
  {
    year: '2014',
    title: '自建材料室',
    text: '添置静水压仪、马丁代尔耐磨机与拉力机。从这一年起，任何一款面料在进入裁剪前，必须先出一份自己的实测报告，不采信供应商标称值。',
  },
  {
    year: '2019',
    title: '3 000 公里质保',
    text: '按每件装备可修理设计：拉链、肩带、扣具、内衬全部是独立可换件，配件至少供应十年。质保里程按实测磨损推算，不是按客诉率估计。',
  },
  {
    year: '2023',
    title: '旧件回收线',
    text: '收回的报废装备拆解后，完好五金与面料进入 RL-RE 配件线。至今回收 6 412 件，其中可复用的部分回流为备件库存。',
  },
  {
    year: '2026',
    title: '全部标在洗标上',
    text: '每一件产品的洗标改为实测标签：项目、方法、实测值印在一起。写不出方法的数据，我们从产品页上删掉。',
  },
];

export const FACTS = [
  { k: '自有材料室', v: '2014 年至今', note: '静水压 / 耐磨 / 拉力 / 盐雾' },
  { k: '备件供应承诺', v: '10 年', note: '拉链、扣具、肩带单卖' },
  { k: '旧件回收', v: '6 412 件', note: '拆解后回流为备件' },
  { k: '返修率', v: '0.61 %', note: '按售出件数计，2025 全年' },
];

/* ======================= 预订批次 ======================= */
export interface Batch {
  id: string;
  label: string;
  eta: string;
  seatsLeft: number;
  note: string;
}

export const BATCHES: Batch[] = [
  { id: 'b1', label: '第一批', eta: '2026 年 11 月', seatsLeft: 38, note: '面料已进裁剪' },
  { id: 'b2', label: '第二批', eta: '2027 年 1 月', seatsLeft: 214, note: '按预订量投产' },
  { id: 'b3', label: '第三批', eta: '2027 年 3 月', seatsLeft: 460, note: '可选全部配色' },
];

/* ======================= 页脚 ======================= */
export const FOOTER_GROUPS = [
  {
    title: '装备',
    links: ['RL-04 硬壳夹克', 'RL-17 卷顶驮包', 'RL-09 工装裤', 'RL-23 抓绒中层', 'RL-31 防风手套'],
  },
  {
    title: '服务',
    links: ['修理与备件', '3 000 公里质保', '旧件回收', '尺码与版型', '洗涤与养护'],
  },
  {
    title: '材料',
    links: ['实测方法汇编', '面料来源', '无氟 DWR 说明', '五金规格', '回收料比例'],
  },
  {
    title: '联系',
    links: ['材料室参观（预约）', '经销与合作', '售后：service@ridgeline.cc', '四川 · 成都 · 科园南路 9 号'],
  },
];

export const CERTS = ['GB/T 32614-2016', 'ISO 9001:2015', 'bluesign® system partner', 'OEKO-TEX® 100'];
