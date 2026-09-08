import { useMemo, useState } from 'react';
import { ProductCard } from './ProductCard';
import { PRODUCTS, SCENES, type SceneId } from '../data/catalog';
import { usePreorder } from '../state/PreorderContext';

type Filter = SceneId | 'all';

export function CatalogSection({ onOpenProduct }: { onOpenProduct: (productId: string) => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const { hasProduct } = usePreorder();

  const visible = useMemo(
    () => (filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.scenes.includes(filter))),
    [filter],
  );

  return (
    <section className="section catalog" id="catalog">
      <div className="container">
        <header className="section-head">
          <h2 className="t-h2 section-head__title">五款装备，每款都带自己的实测标签。</h2>
          <p className="t-lede">
            2026 秋季线。按使用场景筛选，点开任意一款可以看到完整规格、工艺要点，以及它在材料室里跑出来的数字。
          </p>
        </header>

        <div className="catalog__filters" role="group" aria-label="按场景筛选">
          <button
            type="button"
            className="catalog__filter"
            data-active={filter === 'all' || undefined}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            全部 <span className="t-data">{PRODUCTS.length}</span>
          </button>
          {SCENES.map((scene) => {
            const count = PRODUCTS.filter((p) => p.scenes.includes(scene.id)).length;
            return (
              <button
                type="button"
                key={scene.id}
                className="catalog__filter"
                data-active={filter === scene.id || undefined}
                aria-pressed={filter === scene.id}
                onClick={() => setFilter(scene.id)}
              >
                {scene.label} <span className="t-data">{count}</span>
                <span className="catalog__filter-note">{scene.note}</span>
              </button>
            );
          })}
        </div>

        <div className="tick-rule catalog__rule" aria-hidden="true" />

        <div className="catalog__grid">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpenProduct}
              inListing={hasProduct(product.id)}
            />
          ))}
        </div>

        <p className="catalog__foot">
          {visible.length} / {PRODUCTS.length} 款
          <span className="catalog__foot-note">
            全部按 3 000 公里质保设计：拉链、扣具、肩带、内衬均为独立可换件，备件供应十年。
          </span>
        </p>
      </div>
    </section>
  );
}
