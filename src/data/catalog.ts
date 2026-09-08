export type SceneId = 'trekking' | 'climbing' | 'cold' | 'commute';

export type ArtKey = 'shell' | 'pack' | 'pant' | 'fleece' | 'mitt';

export interface Colorway {
  name: string;
  hex: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface MeasuredClaim {
  /** 该卖点对应的实测项目名 */
  label: string;
  value: string;
  unit: string;
  /** 测试方法标准号 */
  method: string;
}

export interface Product {
  id: string;
  /** 型号，兼作洗标编号 */
  code: string;
  /** 英文品名，用 Big Shoulders 排 */
  name: string;
  /** 中文品名 */
  nameZh: string;
  tagline: string;
  blurb: string;
  price: number;
  /** 相较上一版的降价/或首批预订价 */
  compareAt?: number;
  scenes: SceneId[];
  art: ArtKey;
  colorways: Colorway[];
  sizes: string[];
  measured: MeasuredClaim;
  specs: SpecRow[];
  build: string[];
  featured?: boolean;
}

export const SCENES: { id: SceneId; label: string; note: string }[] = [
  { id: 'trekking', label: '长距离徒步', note: '多日负重 / 连续暴露' },
  { id: 'climbing', label: '攀登', note: '高摩擦 / 大幅伸展' },
  { id: 'cold', label: '高寒', note: '-20 °C 以下持续作业' },
  { id: 'commute', label: '城市通勤', note: '雨天 / 骑行 / 高频穿脱' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'rl-04',
    code: 'RL-04',
    name: 'Ridgeline Shell',
    nameZh: '三层压胶硬壳夹克',
    tagline: '把雨挡在数据之外',
    blurb:
      '40D 三层复合面料配 13 mm 宽压胶，帽檐可单手握紧展开。袖口用双重魔术贴收束，长时间戴手套操作也不脱胶。',
    price: 3280,
    compareAt: 3580,
    scenes: ['trekking', 'climbing', 'commute'],
    art: 'shell',
    colorways: [
      { name: '岩灰', hex: '#8C9089' },
      { name: '夜松', hex: '#28382F' },
      { name: '警戒橙', hex: '#EE5A1C' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    measured: {
      label: '静水压',
      value: '28 000',
      unit: 'mm',
      method: 'JIS L 1092 B',
    },
    specs: [
      { label: '面料', value: '40D 三层复合 / ePTFE 膜' },
      { label: '透湿', value: '25 000 g/m²·24h' },
      { label: '接缝强力', value: '2.1 kN（ISO 13935-2）' },
      { label: '自重', value: '412 g（M 码）' },
    ],
    build: [
      '13 mm 宽压胶，接缝处比常规工艺多压 4 mm',
      'YKK #8 防水主拉链，可戴手套拉动，拉头配防磨护套',
      '腋下 22 cm 透气拉链，单手开合',
      '肘部立体剪裁，抬手时下摆不超过 3 cm 位移',
    ],
    featured: true,
  },
  {
    id: 'rl-17',
    code: 'RL-17',
    name: 'Haul 45',
    nameZh: '卷顶防水驮包',
    tagline: '沉到 22 公斤再谈结构',
    blurb:
      '1000D TPU 夹网布高频焊接，卷口三道扣具压合后通过 30 分钟浸水测试。肩带可整体拆卸更换，不必因为一条带子报废整只包。',
    price: 1980,
    scenes: ['trekking', 'commute'],
    art: 'pack',
    colorways: [
      { name: '夜松', hex: '#28382F' },
      { name: '炭黑', hex: '#2B2D2C' },
    ],
    sizes: ['45 L'],
    measured: {
      label: '整包承重',
      value: '22',
      unit: 'kg',
      method: 'GB/T 4980 提吊',
    },
    specs: [
      { label: '面料', value: '1000D TPU 夹网 / 高频焊接' },
      { label: '防水', value: 'IPX6，卷口三道扣具' },
      { label: '背负', value: '铝合金撑条 + 3 mm 高密泡棉' },
      { label: '自重', value: '1 180 g' },
    ],
    build: [
      '受力点全部打枣加固（bar-tack），单点拉力 ≥ 45 kg',
      '肩带、腰带、顶盖为独立可换件，备件单卖',
      '内部分层可水洗，底部排水角阀',
    ],
  },
  {
    id: 'rl-09',
    code: 'RL-09',
    name: 'Field Pant',
    nameZh: '立体剪裁工装裤',
    tagline: '膝盖先弯，布料后弯',
    blurb:
      '四面弹面料配膝部预弯与裆部三角接片，跨步时没有拉扯感。臀部与膝部做双层补强，磨损到寿命只需换裤子的一半。',
    price: 1180,
    scenes: ['climbing', 'trekking', 'commute'],
    art: 'pant',
    colorways: [
      { name: '岩灰', hex: '#8C9089' },
      { name: '苔绿', hex: '#4E6151' },
      { name: '炭黑', hex: '#2B2D2C' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    measured: {
      label: '耐磨',
      value: '40 000',
      unit: '循环',
      method: 'ISO 12947-2',
    },
    specs: [
      { label: '面料', value: '尼龙 86% / 氨纶 14%，四面弹' },
      { label: '撕裂强力', value: '780 g（ISO 4674-1）' },
      { label: '弹力回复', value: '5 次拉伸后变形 < 3%' },
      { label: '自重', value: '498 g（M 码）' },
    ],
    build: [
      '膝部预弯 + 立体裆部接片，下蹲不顶',
      '臀部、膝部双层补强，可单独更换裤腿',
      '九个口袋，重心分布在腰线以下',
      'DWR 无氟防泼水，可反复洗涤不衰减',
    ],
  },
  {
    id: 'rl-23',
    code: 'RL-23',
    name: 'Grid Fleece 300',
    nameZh: '格纹抓绒中间层',
    tagline: '保暖值要能标在洗标上',
    blurb:
      '300 g/m² 六毫米格纹抓绒，内层导湿、外层防风。肘部与肩部贴布后，作为独立外层穿用也不起球。',
    price: 860,
    scenes: ['cold', 'trekking'],
    art: 'fleece',
    colorways: [
      { name: '苔绿', hex: '#4E6151' },
      { name: '燕麦', hex: '#B9B49C' },
      { name: '炭黑', hex: '#2B2D2C' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    measured: {
      label: '保温值',
      value: '1.80',
      unit: 'clo',
      method: 'ISO 11092',
    },
    specs: [
      { label: '克重', value: '300 g/m² 六毫米格纹' },
      { label: '起球', value: '4-5 级（ISO 12945-2）' },
      { label: '透湿', value: '12 800 g/m²·24h' },
      { label: '自重', value: '385 g（M 码）' },
    ],
    build: [
      '下摆收窄设计，套在硬壳内不堆料',
      '拇指扣袖口，静态作业时袖身上滑 < 1 cm',
      '肩部无肩缝设计，负重背包不磨同一点',
    ],
  },
  {
    id: 'rl-31',
    code: 'RL-31',
    name: 'Gauntlet Mitt',
    nameZh: '长款防风手套',
    tagline: '-25 °C 还能系扣子',
    blurb:
      '掌面 1.2 mm 山羊革，指内层可拆出单独清洗。腕口加长至小臂，配束口绳与反光标识。',
    price: 520,
    scenes: ['cold', 'climbing'],
    art: 'mitt',
    colorways: [
      { name: '夜松', hex: '#28382F' },
      { name: '警戒橙', hex: '#EE5A1C' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    measured: {
      label: '低温作业',
      value: '-25',
      unit: '°C',
      method: 'GB/T 5470',
    },
    specs: [
      { label: '掌面', value: '1.2 mm 山羊革 + 加强贴片' },
      { label: '保温', value: 'Primaloft 60 g/m²' },
      { label: '防风', value: '< 5 mm/s（GB/T 5453）' },
      { label: '自重', value: '168 g（M 码，一对）' },
    ],
    build: [
      '内衬可整只抽出，单独手洗',
      '食指与拇指指尖做可触控处理',
      '腕口束绳为反光材质，夜间可见 30 m',
    ],
  },
];

export const SCENE_LABEL: Record<SceneId, string> = SCENES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s.label }),
  {} as Record<SceneId, string>,
);

export const formatPrice = (value: number) =>
  `¥${value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
