import { useState } from 'react';
import { ProductArt } from './ProductArt';
import { formatPrice, type Product } from '../data/catalog';
import { useModal } from '../hooks/useModal';
import { usePreorder } from '../state/PreorderContext';

interface Props {
  product: Product;
  onClose: () => void;
  onGoToPreorder: () => void;
}

export function ProductDrawer({ product, onClose, onGoToPreorder }: Props) {
  const [size, setSize] = useState(product.sizes[Math.min(2, product.sizes.length - 1)]);
  const [color, setColor] = useState(product.colorways[0].name);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addLine } = usePreorder();
  const panelRef = useModal<HTMLDivElement>(true, onClose);

  const confirm = () => {
    addLine({ productId: product.id, size, color, qty });
    setAdded(true);
  };

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <button type="button" className="drawer__scrim" onClick={onClose} aria-label="关闭规格" />
      <div className="drawer__panel on-dark" ref={panelRef} tabIndex={-1}>
        <div className="hazard" aria-hidden="true" />
        <header className="drawer__head">
          <div>
            <span className="drawer__code t-data">{product.code}</span>
            <h2 className="t-h3 drawer__title" id="drawer-title">
              {product.nameZh}
            </h2>
            <p className="drawer__latin">{product.name}</p>
          </div>
          <button type="button" className="drawer__close" onClick={onClose}>
            <span className="sr-only">关闭</span>
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        <div className="drawer__scroll">
          <div className="drawer__art">
            <ProductArt art={product.art} uid={`${product.id}-drawer`} />
          </div>

          <p className="drawer__blurb">{product.blurb}</p>

          <section className="drawer__measured">
            <span className="drawer__measured-label">{product.measured.label}</span>
            <span className="drawer__measured-value t-data">
              {product.measured.value}
              <em>{product.measured.unit}</em>
            </span>
            <span className="drawer__measured-method t-micro">
              测试方法 {product.measured.method} · 同批最差值
            </span>
          </section>

          <section className="drawer__block">
            <h3 className="drawer__block-title">完整规格</h3>
            <dl className="drawer__specs">
              {product.specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd className="t-data">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="drawer__block">
            <h3 className="drawer__block-title">工艺要点</h3>
            <ul className="drawer__build">
              {product.build.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section className="drawer__block">
            <h3 className="drawer__block-title">
              <label htmlFor="drawer-size">尺码</label>
              <span className="drawer__hint">{product.sizes.length > 1 ? '版型偏大半码' : '单一容量'}</span>
            </h3>
            <div className="drawer__choice" role="group" aria-label="尺码" id="drawer-size">
              {product.sizes.map((option) => (
                <button
                  type="button"
                  key={option}
                  className="drawer__chip"
                  data-active={option === size || undefined}
                  aria-pressed={option === size}
                  onClick={() => {
                    setSize(option);
                    setAdded(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="drawer__block">
            <h3 className="drawer__block-title">
              配色
              <span className="drawer__hint">{color}</span>
            </h3>
            <div className="drawer__choice drawer__choice--colors" role="group" aria-label="配色">
              {product.colorways.map((option) => (
                <button
                  type="button"
                  key={option.name}
                  className="drawer__color"
                  data-active={option.name === color || undefined}
                  aria-pressed={option.name === color}
                  onClick={() => {
                    setColor(option.name);
                    setAdded(false);
                  }}
                >
                  <span className="drawer__color-dot" style={{ background: option.hex }} />
                  {option.name}
                </button>
              ))}
            </div>
          </section>

          <section className="drawer__block drawer__block--qty">
            <span className="drawer__block-title">数量</span>
            <div className="stepper">
              <button
                type="button"
                onClick={() => {
                  setQty((value) => Math.max(1, value - 1));
                  setAdded(false);
                }}
                disabled={qty <= 1}
                aria-label="减少数量"
              >
                −
              </button>
              <output className="t-data" aria-live="polite">
                {qty}
              </output>
              <button
                type="button"
                onClick={() => {
                  setQty((value) => Math.min(20, value + 1));
                  setAdded(false);
                }}
                disabled={qty >= 20}
                aria-label="增加数量"
              >
                +
              </button>
            </div>
          </section>
        </div>

        <footer className="drawer__foot">
          <div className="drawer__total">
            <span className="t-micro">合计</span>
            <span className="t-data drawer__total-value">{formatPrice(product.price * qty)}</span>
          </div>
          {added ? (
            <div className="drawer__added">
              <span className="drawer__added-text">已加入预订清单</span>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  onClose();
                  onGoToPreorder();
                }}
              >
                去预订
              </button>
              <button type="button" className="drawer__again" onClick={() => setAdded(false)}>
                再加一次
              </button>
            </div>
          ) : (
            <button type="button" className="btn" onClick={confirm}>
              加入预订清单
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
