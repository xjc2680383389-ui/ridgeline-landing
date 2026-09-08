import { ProductArt } from './ProductArt';
import { SCENE_LABEL, formatPrice, type Product } from '../data/catalog';

interface Props {
  product: Product;
  onOpen: (productId: string) => void;
  inListing: boolean;
}

export function ProductCard({ product, onOpen, inListing }: Props) {
  const { code, name, nameZh, tagline, blurb, measured, specs, price, compareAt } = product;

  return (
    <article className={product.featured ? 'product-card product-card--featured' : 'product-card'}>
      <div className="product-card__art">
        <ProductArt art={product.art} uid={product.id} className="product-card__drawing" />
        <span className="product-card__code t-data">{code}</span>
        <span className="product-card__scenes t-micro">
          {product.scenes.map((scene) => SCENE_LABEL[scene]).join(' / ')}
        </span>
      </div>

      <div className="product-card__body">
        <div>
          <h3 className="product-card__title t-h3">{nameZh}</h3>
          <p className="product-card__latin">{name}</p>
          <p className="product-card__tagline">{tagline}</p>
          <p className="product-card__blurb">{blurb}</p>
        </div>

        <div className="product-card__measured">
          <span className="product-card__measured-label">{measured.label}</span>
          <span className="product-card__measured-value t-data">
            {measured.value}
            <em>{measured.unit}</em>
          </span>
          <span className="product-card__measured-method t-micro">{measured.method}</span>
        </div>

        <dl className="product-card__specs">
          {specs.slice(0, product.featured ? 4 : 3).map((spec) => (
            <div key={spec.label}>
              <dt>{spec.label}</dt>
              <dd className="t-data">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="product-card__foot">
          <div className="product-card__price">
            <span className="t-data">{formatPrice(price)}</span>
            {compareAt && (
              <span className="product-card__compare t-micro">
                <s>{formatPrice(compareAt)}</s> 首批预订价
              </span>
            )}
          </div>

          <div className="product-card__colors" aria-hidden="true">
            {product.colorways.map((colorway) => (
              <span
                key={colorway.name}
                className="product-card__swatch"
                style={{ background: colorway.hex }}
                title={colorway.name}
              />
            ))}
          </div>

          <button type="button" className="btn btn--sm" onClick={() => onOpen(product.id)}>
            {inListing ? '调整清单' : '选尺码加入预订'}
          </button>
        </div>
      </div>
    </article>
  );
}
