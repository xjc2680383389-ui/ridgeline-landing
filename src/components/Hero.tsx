import { ContourField } from './ContourField';
import { PRODUCTS } from '../data/catalog';
import { READOUTS, type Readout as ReadoutData } from '../data/site';
import { useCountUp } from '../hooks/useCountUp';
import { formatGrouped } from '../lib/format';

export function Hero({ onOpenProduct }: { onOpenProduct: (productId: string) => void }) {
  const shell = PRODUCTS.find((p) => p.featured) ?? PRODUCTS[0];

  const labelRows = [
    {
      label: shell.measured.label,
      value: `${shell.measured.value} ${shell.measured.unit}`,
      method: shell.measured.method,
    },
    ...shell.specs.slice(0, 3).map((spec) => ({
      label: spec.label,
      value: spec.value,
      method: '实测',
    })),
  ];

  return (
    <section className="hero on-dark" id="top">
      <ContourField />

      <div className="hero__rail" aria-hidden="true">
        <span className="t-data">Field tested</span>
        <span className="hero__rail-value t-data">2 400 km</span>
        <span className="t-data">Spec 2026-A</span>
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="t-h1 hero__title">
            不耐用的装备，
            <br />
            等于没有装备。
          </h1>
          <p className="hero__latin" aria-hidden="true">
            Built to be measured
          </p>
          <p className="t-lede hero__lede">
            脊线只做能被测量的东西。静水压、耐磨循环、接缝强力、低温脆化——每一项都写明测试方法，并且按同批面料的最差值标注。写不出方法的数据，我们就不写。
          </p>
          <div className="hero__actions">
            <a className="btn" href="#preorder">
              预订 2026 秋季线
            </a>
            <a className="btn btn--ghost" href="#proof">
              查看实测报告
            </a>
          </div>
        </div>

        <aside className="care-label hero__label" aria-label={`${shell.code} 实测标签`}>
          <div className="hero__label-head">
            <span className="hero__label-code t-data">{shell.code}</span>
            <span className="hero__label-name">{shell.nameZh}</span>
          </div>
          <dl className="hero__label-rows">
            {labelRows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>
                  <span className="t-data">{row.value}</span>
                  <span className="hero__label-method t-micro">{row.method}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="hazard" aria-hidden="true" />
          <div className="hero__label-foot">
            <span className="t-micro">洗标即规格表</span>
            <button type="button" className="hero__label-link" onClick={() => onOpenProduct(shell.id)}>
              看这件的完整规格
            </button>
          </div>
        </aside>
      </div>

      <div className="hero__strip">
        <div className="container hero__strip-inner">
          {READOUTS.map((item, index) => (
            <Readout key={item.label} data={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Readout({ data, index }: { data: ReadoutData; index: number }) {
  const { ref, value } = useCountUp(data.value, {
    duration: 1500,
    delay: 260 + index * 110,
    decimals: data.decimals,
  });

  return (
    <div className="readout">
      <span className="readout__label">{data.label}</span>
      <span className="readout__value t-data">
        <span ref={ref}>{formatGrouped(value, data.decimals)}</span>
        <em>{data.unit}</em>
      </span>
      <span className="readout__method t-micro">{data.method}</span>
    </div>
  );
}
